import assert from 'node:assert/strict';
import createShoppingListsApi from '../web/api/shopping-lists-api.mjs';
import createShoppingListsServicesMock from './mocks/shopping-lists-services-mock.mjs';
import createUsersServicesMock, { USER, VALID_TOKEN } from './mocks/users-services-mock.mjs';

// With the Router, shoppingListsApi is an Express Router (a middleware function)
// containing the middleware pipeline (JSON body parser, auth) and registered routes.
// Runs the router with a fake Express response and resolves with it when json() or next() is called.
function run(handler, req) {
  return new Promise(resolve => {
    const res = {
      statusCode: 200,
      status(code) { this.statusCode = code; return this; },
      json(body) { this.body = body; resolve(this); }
    };
    const next = () => resolve(res);
    handler(req, res, next);
  });
}

// Creates an authorized request specifying the HTTP method and route path for the router.
function createAuthorizedRequest(method, url, body = {}, authorization = `Bearer ${VALID_TOKEN}`) {
  const req = {
    user: USER,
    method,
    url,
    headers: {},
    body,
    get: () => authorization
  };
  return req;
}

// Creates a request to test authentication through the router's middleware pipeline.
function createRequestForAuthentication(parameters = {}, body = {}, authorization) {
  const req = {
    method: 'GET',
    url: '/lists',
    headers: {},
    params: parameters,
    body,
    get: (header) => header?.toLowerCase() === 'authorization' ? authorization : undefined
  };
  return req;
}

describe('Shopping Lists API', () => {
  let shoppingListsServicesMock;
  let shoppingListsApi;
  let usersServicesMock;

  beforeEach(() => {
    shoppingListsServicesMock = createShoppingListsServicesMock();
    usersServicesMock = createUsersServicesMock();
    shoppingListsApi = createShoppingListsApi(shoppingListsServicesMock, usersServicesMock);
  });

  describe('creating module and checking dependencies', () => {
    it('throws if the Shopping Lists services are not provided', () => {
      // assert.throws() expects a function that throws an error.
      assert.throws(() => createShoppingListsApi(undefined, createUsersServicesMock()), 
      /Shopping Lists services module is required/);
    });

    it('throws if the users services are not provided', () => {
      assert.throws(() => createShoppingListsApi(shoppingListsServicesMock, undefined), 
      /Users services module is required/);
    });
  });

  describe('validating authentication middleware', () => {

    it('sets req.user and calls next with a valid token', async () => {
      const req = createRequestForAuthentication({}, {}, `Bearer ${VALID_TOKEN}`);
      // The router executes the authentication middleware before route handlers.
      await run(shoppingListsApi, req);
      assert.deepEqual(req.user, USER);
    });

    it('responds 401 without the Authorization header', async () => {
      const req = createRequestForAuthentication({}, {}, undefined);
      const res = await run(shoppingListsApi, req);
      assert.equal(res.statusCode, 401);
    });

    it('responds 401 with a wrong scheme', async () => {
      const req = createRequestForAuthentication({}, {}, `Basic ${VALID_TOKEN}`);  
      const res = await run(shoppingListsApi, req);
      assert.equal(res.statusCode, 401);
    });

    it('responds 401 with an invalid token', async () => {
      const req = createRequestForAuthentication({}, {}, `Bearer wrong`);
      const res = await run(shoppingListsApi, req);
      assert.equal(res.statusCode, 401);
      assert.equal(req.user, undefined);
    });
  });

  describe('validating Shopping Lists handlers', () => {
    // The router dispatches requests to handlers based on HTTP method and path, extracting route parameters (e.g. :id).
    const expectedList = { id: 1, name: 'Groceries', items: [] };

    it('getLists responds with the lists of the user', async () => {
      const req = createAuthorizedRequest('GET', '/lists');
      const res = await run(shoppingListsApi, req);
      assert.equal(res.statusCode, 200);
      assert.equal(res.body.lists.length, 1);
      assert.deepEqual(res.body.lists[0], expectedList);
    });

    it('getList responds with the list', async () => {
      const req = createAuthorizedRequest('GET', '/lists/1');
      const res = await run(shoppingListsApi, req);
      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.body, expectedList);
    });

    it('createList responds 201 with the new list', async () => {
      const req = createAuthorizedRequest('POST', '/lists', { name: 'Party' });
      const res = await run(shoppingListsApi, req);
      assert.equal(res.statusCode, 201);
      assert.equal(res.body.list.name, 'Party');
      assert.match(res.body.message, /was added/);
    });

    it('addItem responds 201 with the new item', async () => {
      const req = createAuthorizedRequest('POST', '/lists/1/items', { name: 'Milk' });
      const res = await run(shoppingListsApi, req);
      assert.equal(res.statusCode, 201);
      assert.equal(res.body.item.name, 'Milk');
    });

    it('maps a service error to the HTTP status (list not found -> 404)', async () => {
      const req = createAuthorizedRequest('GET', '/lists/99');
      const res = await run(shoppingListsApi, req);
      assert.equal(res.statusCode, 404);
      assert.ok(res.body.message);
    });
  });
});
