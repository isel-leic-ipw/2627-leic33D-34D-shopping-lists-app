import * as services from '../../services/users-services.mjs';
import wrapperHandler from './helpers.mjs';

export const createUser = wrapperHandler(createUserInternal);

function createUserInternal(req, res) {

    const { username, password } = req.body ?? {};

    return services.createUser(username, password)
        .then(newUser => {
            // The user was created successfully, so return it as a JSON response
            res.status(201);
            return {
                message: `User ${username} was created successfully.`,
                user: newUser
            };
        });
}
