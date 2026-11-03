import crypto from 'crypto';

// DATA in memory: users
const users = [
  { id: 1, username: 'alice', password: 'password123', apiToken: '75ea9010-65e4-4fa8-b13c-7c0348b16e12' },
  { id: 2, username: 'bob', password: 'secret456', apiToken: 'a842fc53-e219-45e0-8c52-47944f2fbd30' },
  { id: 3, username: 'charlie', password: 'test789', apiToken: 'd61b3bc1-3679-4981-97cd-cdc736667851' }
];

// Get a user by api token
export function getUserByToken(token){

  const user = users.find(user => user.apiToken === token);
  return user;
}

// Get a user by username
export function getUserByUsername(username){

  const user = users.find(user => user.username === username);
  return user;
}

// Create a new user
export function createUser(username, password){

  // Create a new user object with a unique ID and an API token
  const newUserId = users.length + 1;
  const apiToken = crypto.randomUUID(); // Generate a unique API token for the new user
  const newUser = { id: newUserId, username, password, apiToken };

  // Add the new user to the in-memory users array
  users.push(newUser);

  return newUser;
}
