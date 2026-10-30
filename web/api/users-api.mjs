import * as services from '../../services/users-services-and-data.mjs';
import { InternalError } from '../../commons/errors.mjs';
import mapToHttpError from '../map-to-http-errors.mjs';

export function createUser(req, res) {

    const { username, password } = req.body ?? {};

    const ret = services.createUser(username, password);

    // TODO: user another error handler to avoid code repetition in all handlers.
    if (ret.constructor === InternalError){
      const httpError = mapToHttpError(ret);
      res.status(httpError.status);
      res.json(httpError.error);
      return;
    }

    // Otherwise, the user was created successfully, so send it as a JSON response
    const newUser = ret;
    return res.status(201).json({
        message: `User ${username} was created successfully.`,
        user: newUser
    });
}
