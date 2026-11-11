import ERRORS from '../../commons/errors.mjs';

export const VALID_TOKEN = 'valid-token';
export const USER = { id: 5, username: 'alice'};

// Mock of the users services, injected in the Shopping Lists API (authentication middleware).
export default function createUsersServicesMock() {
  return { 
    getUserByToken 
  };

  function getUserByToken(token) {
    return token === VALID_TOKEN
      ? Promise.resolve(USER)
      : Promise.reject(ERRORS.INVALID_API_TOKEN());
  }
}
