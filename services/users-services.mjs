import * as data from '../data/memory/users-data-mem.mjs';
import ERRORS from '../commons/errors.mjs';

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

// Get a user by api token
export function getUserByToken(token){
  console.log("Getting user by token (services)");

  const user = data.getUserByToken(token);

  // If the token is missing or does not match any user, return an invalid token error
  if (!user){
    return ERRORS.INVALID_API_TOKEN();
  }

  // Remove sensitive data before returning the user
  return removeSensitiveData(user);
}

// Create a new user
export function createUser(username, password){
  console.log("Creating user (services):", username);

  // Validate the request body for the new user: 
  // username is required, password is required
  if (!username || !password) {
    return ERRORS.INVALID_PARAMETER('username/password', 'Username and password are required.');
  }

  // Check if the username already exists
  const existingUser = data.getUserByUsername(username);
  if (existingUser) {
    return ERRORS.USER_ALREADY_EXISTS(username, 'Please choose a different username.');
  }

  // Call the data module to create a new user
  const newUser = data.createUser(username, password);

  // Remove password before returning the new user
  return removePassword(newUser);
}
