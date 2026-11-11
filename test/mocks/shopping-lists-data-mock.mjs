import ERRORS from '../../commons/errors.mjs';

// Mock of the data module, injected in the Shopping Lists services.
// The list with id 1 is the only one that exists.
export default function createShoppingListsDataMock() {
  const existingList = { id: 1, name: 'Groceries', items: [] };
  const isExistingList = id => String(id) === '1';

  return {
    getLists(userId) {
      return Promise.resolve([existingList]);
    },

    getList(userId, id) {
      return isExistingList(id)
        ? Promise.resolve(existingList)
        : Promise.reject(ERRORS.LIST_NOT_FOUND(id));
    },

    createNewList(userId, name) {
      return Promise.resolve({ id: 2, name, items: [] });
    },

    updateList(userId, id, name) {
      return isExistingList(id)
        ? Promise.resolve({ ...existingList, name })
        : Promise.reject(ERRORS.LIST_NOT_FOUND(id));
    },

    removeList(userId, id) {
      return isExistingList(id)
        ? Promise.resolve(existingList)
        : Promise.reject(ERRORS.LIST_NOT_FOUND(id));
    },

    addItemToList(userId, listId, item) {
      const newItem = Object.assign({ id: 10, quantity: 1, bought: false }, item);
      return isExistingList(listId)
        ? Promise.resolve(newItem)
        : Promise.reject(ERRORS.LIST_NOT_FOUND(listId));
    },

    updateItemFromList(userId, listId, itemId, partialItem) {
      const updatedItem = Object.assign({ id: itemId, name: 'Milk', quantity: 1, bought: false }, partialItem);
      return isExistingList(listId)
        ? Promise.resolve(updatedItem)
        : Promise.reject(ERRORS.LIST_NOT_FOUND(listId));
    },

    removeItemFromList(userId, listId, itemId) {
      return isExistingList(listId)
        ? Promise.resolve({ id: itemId, name: 'Milk', quantity: 1, bought: false })
        : Promise.reject(ERRORS.LIST_NOT_FOUND(listId));
    }
  };
}
