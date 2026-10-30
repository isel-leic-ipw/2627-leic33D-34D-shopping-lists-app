import { getUserByToken } from '../services/users-services-and-data.mjs';
import ERRORS, { InternalError } from '../commons/errors.mjs';
import mapToHttpError from './map-to-http-errors.mjs';

// Authenticates the request using the "Authorization: Bearer <token>" header
export default function authMiddleware(req, res, next){
    const authorization = req.get('Authorization');
    const [scheme, token] = authorization?.trim().split(' ') ?? [];

    // TODO: use a centralized error handler to avoid code repetition in all handlers.
    if (scheme !== 'Bearer' || !token) {
        const httpError = mapToHttpError(ERRORS.AUTHENTICATION_REQUIRED('Token is required.'));
        res.status(httpError.status);
        res.json(httpError.error);
        return;
    }

    const ret = getUserByToken(token);

    // TODO: use a centralized error handler to avoid code repetition in all handlers.
    if (ret.constructor === InternalError){
        const httpError = mapToHttpError(ret);
        res.status(httpError.status);
        res.json(httpError.error);
        return;
    }

    // Now, the context is a user, so we can check if the user is valid
    const user = ret;

    if (!user || user.id === undefined) {
        const httpError = mapToHttpError(ERRORS.AUTHENTICATION_REQUIRED('Invalid token.'));
        res.status(httpError.status);
        res.json(httpError.error);
        return;
    }

    // Make the authenticated user available to the next handlers
    req.user = user;
    next();
}
