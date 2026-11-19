import Errors from '../commons/errors.mjs';
import mapToHttpError from './map-to-http-errors.mjs';

// Sends the mapped HTTP error response
export function sendHttpError(res, error) {
    const httpError = mapToHttpError(error);
    res.status(httpError.status);
    res.json(httpError.error);
}

// Middleware to handle non-existent routes (Not Found)
export function notFoundHandler(req, res, next) {
    const error = Errors.ROUTE_NOT_FOUND(req.method, req.originalUrl || req.url);
    next(error);
}

// Centralized error-handling middleware for Express using mapToHttpError (in sendHttpError)
export function errorHandler(err, req, res, next) {
    //console.error('Error occurred:', err); // Log the error for debugging
    // If response headers have already been sent, delegate to Express default handler
    if (res.headersSent) {
        return next(err);
    }
    sendHttpError(res, err);
}


