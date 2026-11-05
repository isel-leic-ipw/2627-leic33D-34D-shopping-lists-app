import { getUserByToken } from '../services/users-services.mjs';
import ERRORS from '../commons/errors.mjs';
import { sendHttpError } from './api/helpers.mjs';

// Authenticates the request using the "Authorization: Bearer <token>" header
export default function authMiddleware(req, res, next){
    const authorization = req.get('Authorization');
    const [scheme, token] = authorization?.trim().split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
        sendHttpError(res, ERRORS.AUTHENTICATION_REQUIRED('Token is required.'));
        return;
    }

    getUserByToken(token)
        .then(user => {
            // Make the authenticated user available to the next handlers
            req.user = user;
            next();
        })
        .catch(error => {
            sendHttpError(res, error);
        });
}
