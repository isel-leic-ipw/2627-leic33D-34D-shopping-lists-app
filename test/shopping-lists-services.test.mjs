import assert from 'node:assert/strict';
import createShoppingListsServices from '../services/shopping-lists-services.mjs';
import createShoppingListsDataMock from './mocks/shopping-lists-data-mock.mjs';
import { ERROR_CODES } from '../commons/errors.mjs';

const USER_ID = 1;

// Asserts that the Promise is rejected with an InternalError with the given code.
async function assertRejectsWithCode(promise, code) {
  await assert.rejects(promise, error => {
    assert.equal(error.code, code);
    return true;
  });
}

describe('Shopping Lists services', () => {
  let data;
  let services;

  beforeEach(() => {
    data = createShoppingListsDataMock();
    services = createShoppingListsServices(data);
  });

  it('throws if the data module is not provided', () => {
    // assert.throws() expects a function that throws an error.
    assert.throws(() => createShoppingListsServices(), /data module is required/);
  });

  describe('getLists', () => {
    it('returns the lists of the user', async () => {
      const lists = await services.getLists(USER_ID);
      assert.equal(lists.length, 1);
      assert.deepEqual(lists, [{ id: 1, name: 'Groceries', items: [] }]);
    });

    it('rejects if the userId is missing', async () => {
      await assertRejectsWithCode(services.getLists(undefined), ERROR_CODES.INVALID_PARAMETER_CODE);
    });
  });

  describe('getList', () => {
    it('returns an existing list', async () => {
      const list = await services.getList(USER_ID, '1');
      assert.deepEqual(list, { id: 1, name: 'Groceries', items: [] });
    });

    it('rejects if the list does not exist', async () => {
      await assertRejectsWithCode(services.getList(USER_ID, '99'), ERROR_CODES.LIST_NOT_FOUND_CODE);
    });

    it('rejects if the id is missing', async () => {
      await assertRejectsWithCode(services.getList(USER_ID, undefined), ERROR_CODES.INVALID_PARAMETER_CODE);
    });
  });

  describe('createNewList', () => {
    it('creates a list with the trimmed name', async () => {
      const list = await services.createNewList(USER_ID, '  Party  ');
      assert.equal(list.name, 'Party');
    });

    // Test invalid names with a loop to avoid repeating similar test cases.
    for (const invalidName of [undefined, null, '', '   ', 42]) {
      it(`rejects the invalid name ${JSON.stringify(invalidName)}`, async () => {
        await assertRejectsWithCode(
          services.createNewList(USER_ID, invalidName),
          ERROR_CODES.INVALID_PARAMETER_CODE
        );
      });
    }
  });

  describe('addItemToList', () => {
    it('adds a valid item', async () => {
      const item = await services.addItemToList(USER_ID, '1', { name: 'Milk', quantity: 2 });
      assert.equal(item.name, 'Milk');
      assert.equal(item.quantity, 2);
    });

    it('accepts an item with only the name', async () => {
      const item = await services.addItemToList(USER_ID, '1', { name: 'Bread' });
      assert.equal(item.name, 'Bread');
    });

    const invalidItems = {
      'missing item': undefined,
      'missing name': { quantity: 1 },
      'empty name': { name: '  ' },
      'quantity zero': { name: 'Milk', quantity: 0 },
      'non-integer quantity': { name: 'Milk', quantity: 1.5 },
      'non-boolean bought': { name: 'Milk', bought: 'yes' }
    };

    // Test invalid items with a loop to avoid repeating similar test cases.
    for (const [description, item] of Object.entries(invalidItems)) {
      it(`rejects an item with ${description}`, async () => {
        await assertRejectsWithCode(
          services.addItemToList(USER_ID, '1', item),
          ERROR_CODES.INVALID_PARAMETER_CODE
        );
      });
    }

    it('rejects if the list does not exist', async () => {
      await assertRejectsWithCode(
        services.addItemToList(USER_ID, '99', { name: 'Milk' }),
        ERROR_CODES.LIST_NOT_FOUND_CODE
      );
    });
  });
});
