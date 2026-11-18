import express from 'express';
import wrapperHandler from './helpers.mjs';

export default function createUsersApi(usersServices) {

  if (!usersServices) {
    throw new Error('The usersServices module is required in Users API');
  }

  const router = express.Router();

  router.use(express.json());
  router.post('/users', wrapperHandler(createUserInternal));

  return router;

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
