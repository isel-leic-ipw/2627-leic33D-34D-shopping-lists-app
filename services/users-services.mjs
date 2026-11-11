import Errors from '../commons/errors.mjs';

// Remove sensitive data (password and apiToken) from a user object
function removeSensitiveData(user) {
  const { password, apiToken, ...safeUser } = user;
  return safeUser;
}

// Remove the password from a user object
function removePassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export default function createUsersServices(data) {
  // Check if the data module is provided
  if (!data) {
    throw new Error('The data module is required in Users Services');
  }

  // Return the service functions
  return {
    getUserByToken,
    createUser
  };

  // Get a user by api token. The Promise is rejected with an InternalError if the token is invalid.
  function getUserByToken(token){
    console.log("Getting user by token (services)");

    return data.getUserByToken(token).then(user => {

      // If the token is missing or does not match any user, reject with an invalid token error
      if (!user){
        return Promise.reject(Errors.INVALID_API_TOKEN());
      }

      // Remove sensitive data before returning the user
      return removeSensitiveData(user);
    });
  }

  // Create a new user. The Promise is rejected with an InternalError if the user cannot be created.
  function createUser(username, password){
    console.log("Creating user (services):", username);

    // Validate the request body for the new user: 
    // username is required, password is required
    if (!username || !password) {
      return Promise.reject(Errors.INVALID_PARAMETER('username/password', 'Username and password are required.'));
    }

    // Check if the username already exists
    return data.getUserByUsername(username)
      .then(existingUser => {
        if (existingUser) {
          return Promise.reject(Errors.USER_ALREADY_EXISTS(username, 'Please choose a different username.'));
        }

        // Call the data module to create a new user
        return data.createUser(username, password);
      })
      // Remove password before returning the new user
      .then(newUser => removePassword(newUser));
  }
}
