import assert from 'node:assert/strict';
import { notFoundHandler, errorHandler } from '../web/error-middleware.mjs';
import mapToHttpError from '../web/map-to-http-errors.mjs';
import { ERROR_CODES } from '../commons/errors.mjs';
import Errors from '../commons/errors.mjs';

function createMockResponse() {
  const res = {
    statusCode: 200,
    headersSent: false,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
  return res;
}

describe('Error-handler middleware', () => {

  describe('notFoundHandler and errorHandler for GET request to unknown route', () => {
    it('responds 404 with route not found message and description', async () => {
      const req = { method: 'GET', url: '/api/unknown', originalUrl: '/api/unknown' };
      const res = createMockResponse();
      let nextCalled = false;
      let errorPassedToNext = null;
      const next = (err) => {nextCalled = true; errorPassedToNext = err;};

      // Call the notFoundHandler and await the rejected promise
      notFoundHandler(req, res, next);
      assert.equal(nextCalled, true);
      assert.equal(errorPassedToNext.code, ERROR_CODES.ROUTE_NOT_FOUND_CODE);

      // Now test the errorHandler with the error passed to next
      errorHandler(errorPassedToNext, req, res, next);
      assert.equal(res.statusCode, 404);
      assert.equal(res.body.message, 'Route not found');
      assert.match(res.body.description, /Cannot GET \/api\/unknown/);
    });
  });

  describe('notFoundHandler for DELETE request without the id', () => {
    it('responds 404 with route not found message and description', async () => {
      const req = { method: 'DELETE', url: '/api/lists', originalUrl: '/api/lists' };
      const res = createMockResponse();
      let nextCalled = false;
      let errorPassedToNext = null;
      const next = (err) => {nextCalled = true; errorPassedToNext = err;};

      // Call the notFoundHandler and await the rejected promise
      notFoundHandler(req, res, next);
      assert.equal(nextCalled, true);
      assert.equal(errorPassedToNext.code, ERROR_CODES.ROUTE_NOT_FOUND_CODE);

      // Now test the errorHandler with the error passed to next
      errorHandler(errorPassedToNext, req, res, next);
      assert.equal(res.statusCode, 404);
      assert.equal(res.body.message, 'Route not found');
      assert.match(res.body.description, /Cannot DELETE \/api\/lists/);
    });
  });

  describe('errorHandler for various error types', () => {
    it('handles JSON parsing SyntaxError with status 400', () => {
      const syntaxError = new SyntaxError('Unexpected token in JSON');
      syntaxError.status = 400;
      syntaxError.body = '{ bad json ';
      const req = {};
      const res = createMockResponse();
      let nextCalled = false;
      const next = () => {nextCalled = true;};

      errorHandler(syntaxError, req, res, next);

      assert.equal(res.statusCode, 400);
      assert.equal(res.body.message, 'SyntaxError');
      assert.ok(res.body.description);
      assert.equal(nextCalled, false);
    });

    it('handles application InternalError by mapping to HTTP status', () => {
      const internalError = Errors.LIST_NOT_FOUND('42');
      const req = {};
      const res = createMockResponse();
      const next = () => {};

      errorHandler(internalError, req, res, next);

      assert.equal(res.statusCode, 404);
      assert.equal(res.body.message, 'List with id 42 not found');
    });

    it('handles unexpected errors with status 500', () => {
      const originalConsoleError = console.error;
      console.error = () => {}; // suppress test output
      try {
        const error = new Error('Database exploded');
        const req = {};
        const res = createMockResponse();
        let nextCalled = false;
        const next = () => {nextCalled = true;};

        errorHandler(error, req, res, next);

        assert.equal(res.statusCode, 500);
        assert.equal(nextCalled, false);
      } finally {
        console.error = originalConsoleError;
      }
    });

    it('delegates to next(err) if headers are already sent', () => {
      const error = new Error('Late error');
      const req = {};
      const res = createMockResponse();
      res.headersSent = true;
      let passedError = null;

      errorHandler(error, req, res, (err) => {
        passedError = err;
      });

      assert.equal(passedError, error);
    });
  });

  describe('Test mapToHttpError function', () => {

    it('maps ROUTE_NOT_FOUND to 404', () => {
      const err = Errors.ROUTE_NOT_FOUND('GET', '/unknown');
      const response = mapToHttpError(err);
      assert.equal(response.status, 404);
      assert.equal(response.error.message, 'Route not found');
    });

    it('maps INVALID_PARAMETER to 400', () => {
      const err = Errors.INVALID_PARAMETER('paramName');
      const response = mapToHttpError(err);
      assert.equal(response.status, 400);
      assert.equal(response.error.message, 'Invalid parameter: paramName');
    });

    it('maps UNEXPECTED_ERROR to 500', () => {
      const err = new Error('Unexpected error');
      const response = mapToHttpError(err);
      assert.equal(response.status, 500);
      assert.equal(response.error.message, 'Internal server error');
    });
  });
});
