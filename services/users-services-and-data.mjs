import ERRORS from '../commons/errors.mjs';
import crypto from 'crypto';
// This module represents users services + data
// TODO: separate service module from data module.

// DATA in memory: users
const users = [
  { id: 1, username: 'alice', password: 'password123', apiToken: '75ea9010-65e4-4fa8-b13c-7c0348b16e12' },
  { id: 2, username: 'bob', password: 'secret456', apiToken: 'a842fc53-e219-45e0-8c52-47944f2fbd30' },
  { id: 3, username: 'charlie', password: 'test789', apiToken: 'd61b3bc1-3679-4981-97cd-cdc736667851' }
];

// Get a user by api token
export function getUserByToken(token){
  console.log("Getting user by token (services)");

  const user = users.find(user => user.apiToken === token);

  // If the token is missing or does not match any user, return an invalid token error
  if (!user){
    return ERRORS.INVALID_API_TOKEN();
  }

  return removeSensitiveData(user);
}

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

// Create a new user
export function createUser(username, password){
  console.log("Creating user (services):", username);

  // Validate the request body for the new user: 
  // username is required, password is required
  if (!username || !password) {
    return ERRORS.INVALID_PARAMETER('username/password', 'Username and password are required.');
  }

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return ERRORS.USER_ALREADY_EXISTS(username, 'Please choose a different username.');
  }

  // Create a new user object with a unique ID and an API token
  const newUserId = users.length + 1;
  const apiToken = crypto.randomUUID(); // Generate a unique API token for the new user
  const newUser = { id: newUserId, username, password, apiToken };

  // Add the new user to the in-memory users array
  users.push(newUser);

  // Remove password before returning the user
  return removePassword(newUser);
}
