import wrapperHandler from './helpers.mjs';

export default function createUsersApi(usersServices) {

  if (!usersServices) {
    throw new Error('The usersServices module is required in Users API');
  }

  // Operations on users using the wrapperHandler function.
  // Each internal handler returns a Promise: resolved with the response body or rejected with an InternalError.
  return {
    createUser: wrapperHandler(createUserInternal)
  };

  // Create a new user
  function createUserInternal(req, res) {

    const { username, password } = req.body ?? {};

    return usersServices.createUser(username, password)
      .then(newUser => {
        // The user was created successfully, so return it as a JSON response
        res.status(201);
        return {
          message: `User ${username} was created successfully.`,
          user: newUser
        };
      });
  }
}
