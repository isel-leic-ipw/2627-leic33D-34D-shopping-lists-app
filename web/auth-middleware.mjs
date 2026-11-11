import ERRORS from '../commons/errors.mjs';
import { sendHttpError } from './api/helpers.mjs';


// Authenticates the request using the "Authorization: Bearer <token>" header
export default function createBearerAuthMiddleware(userServices) {
    if (!userServices) {
        throw new Error('The userServices module is required');
    }

    // Return directly the middleware function
    return bearerToken;
    
    function bearerToken(req, res, next) {
        const authorization = req.get('Authorization');
        const [scheme, token] = authorization?.trim().split(' ') ?? [];

        if (scheme !== 'Bearer' || !token) {
            sendHttpError(res, ERRORS.AUTHENTICATION_REQUIRED('Token is required.'));
            return;
        }

        return userServices.getUserByToken(token)
            .then(user => {
                // Make the authenticated user available to the next handlers
                req.user = user;
                next();
            })
            .catch(error => {
                sendHttpError(res, error);
            });
    }
}
