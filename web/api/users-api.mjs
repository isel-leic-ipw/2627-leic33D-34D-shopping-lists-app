import * as services from '../../services/users-services.mjs';
import { InternalError } from '../../commons/errors.mjs';
import wrapperHandler from './handler-request-response.mjs';

export const createUser = wrapperHandler(createUserInternal);

function createUserInternal(req, res) {

    const { username, password } = req.body ?? {};

    const ret = services.createUser(username, password);

    // In case of success, return a message indicating that the user was created
    if (ret.constructor !== InternalError){
        // The user was created successfully, so return it as a JSON response
        const newUser = ret;
        res.status(201);
        return {
            message: `User ${username} was created successfully.`,
            user: newUser
        };
    }

    return ret;
}
