import assert from 'node:assert/strict';
import createShoppingListsApi from '../web/api/shopping-lists-api.mjs';
import createShoppingListsServicesMock from './mocks/shopping-lists-services-mock.mjs';
import createUsersServicesMock, { USER, VALID_TOKEN } from './mocks/users-services-mock.mjs';

// Each API operation is [authMiddleware, handler].
const [AUTH, HANDLER] = [0, 1];

// Runs a handler with a fake Express response and resolves with it when json() or next() is called.
function run(handler, req) {
  return new Promise(resolve => {
    const res = {
      statusCode: 200,
      status(code) { this.statusCode = code; return this; },
      json(body) { this.body = body; resolve(this); }
    };
    const next = () => resolve(res);
    handler(req, res, next);
  });
}

function createAuthorizedRequest(parameters = {}, body = {}, user = USER) {
  const req = {
    user,
    params: parameters,
    body
  };
  return req;
}

function createRequestForAuthentication(parameters = {}, body = {}, authorization) {
  const req = {
    params: parameters,
    body,
    get: () => authorization
  };
  return req;
}

describe('Shopping Lists API', () => {
  let shoppingListsServicesMock;
  let shoppingListsApi;
  let usersServicesMock;

  beforeEach(() => {
    shoppingListsServicesMock = createShoppingListsServicesMock();
    usersServicesMock = createUsersServicesMock();
    shoppingListsApi = createShoppingListsApi(shoppingListsServicesMock, usersServicesMock);
  });

  describe('creating module and checking dependencies', () => {
    it('throws if the Shopping Lists services are not provided', () => {
      // assert.throws() expects a function that throws an error.
      assert.throws(() => createShoppingListsApi(undefined, createUsersServicesMock()), 
      /Shopping Lists services module is required/);
    });

    it('throws if the users services are not provided', () => {
      assert.throws(() => createShoppingListsApi(shoppingListsServicesMock, undefined), 
      /Users services module is required/);
    });
  });

  describe('validating authentication middleware', () => {

    it('sets req.user and calls next with a valid token', async () => {
      const req = createRequestForAuthentication({}, {}, `Bearer ${VALID_TOKEN}`);
      // shoppingListsApi.getLists[AUTH] is the authMiddleware, which sets req.user and
      // calls next() if the token is valid.
      const res = await run(shoppingListsApi.getLists[AUTH], req);
      assert.deepEqual(req.user, USER);
      assert.equal(res.body, undefined);
    });

    it('responds 401 without the Authorization header', async () => {
      const req = createRequestForAuthentication({}, {}, undefined);
      const res = await run(shoppingListsApi.getLists[AUTH], req);
      assert.equal(res.statusCode, 401);
    });

    it('responds 401 with a wrong scheme', async () => {
      const req = createRequestForAuthentication({}, {}, `Basic ${VALID_TOKEN}`);  
      const res = await run(shoppingListsApi.getLists[AUTH], req);
      assert.equal(res.statusCode, 401);
    });

    it('responds 401 with an invalid token', async () => {
      const req = createRequestForAuthentication({}, {}, `Bearer wrong`);
      const res = await run(shoppingListsApi.getLists[AUTH], req);
      assert.equal(res.statusCode, 401);
      assert.equal(req.user, undefined);
    });
  });

  describe('validating Shopping Lists handlers', () => {
    const expectedList = { id: 1, name: 'Groceries', items: [] };

    it('getLists responds with the lists of the user', async () => {
      const req = createAuthorizedRequest({}, {});
      const res = await run(shoppingListsApi.getLists[HANDLER], req);
      assert.equal(res.statusCode, 200);
      assert.equal(res.body.lists.length, 1);
      assert.deepEqual(res.body.lists[0], expectedList);
    });

    it('getList responds with the list', async () => {
      const req = createAuthorizedRequest({id: '1'}, {});
      const res = await run(shoppingListsApi.getList[HANDLER], req);
      assert.equal(res.statusCode, 200);
      assert.deepEqual(res.body, expectedList);
    });

    it('createList responds 201 with the new list', async () => {
      const req = createAuthorizedRequest({}, { name: 'Party' });
      const res = await run(shoppingListsApi.createList[HANDLER], req);
      assert.equal(res.statusCode, 201);
      assert.equal(res.body.list.name, 'Party');
      assert.match(res.body.message, /was added/);
    });

    it('addItem responds 201 with the new item', async () => {
      const req = createAuthorizedRequest({id: '1'}, { name: 'Milk' });
      const res = await run(shoppingListsApi.addItem[HANDLER], req);
      assert.equal(res.statusCode, 201);
      assert.equal(res.body.item.name, 'Milk');
    });

    it('maps a service error to the HTTP status (list not found -> 404)', async () => {
      const req = createAuthorizedRequest({id: '99'}, {});
      const res = await run(shoppingListsApi.getList[HANDLER], req);
      assert.equal(res.statusCode, 404);
      assert.ok(res.body.message);
    });
  });
});
