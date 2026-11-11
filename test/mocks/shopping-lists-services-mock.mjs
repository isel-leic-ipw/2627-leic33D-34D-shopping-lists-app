import ERRORS from '../../commons/errors.mjs';

// Mock of the Shopping Lists services, injected in the Shopping Lists API.
// The list with id 1 is the only one that exists.
export default function createShoppingListsServicesMock() {
  const existingList = { id: 1, name: 'Groceries', items: [] };
  const isExistingList = id => String(id) === '1';

  return {
    // Simulate getting all lists for a user.
    getLists(userId) {
      return Promise.resolve([existingList]);
    },

    getList(userId, id) {
      // Simulate getting a list by id. If it does not exist, the Promise is rejected.
      return isExistingList(id)
        ? Promise.resolve(existingList)
        : Promise.reject(ERRORS.LIST_NOT_FOUND(id));
    },

    createNewList(userId, name) {
      // Simulate creating a new list (successful creation)
      return Promise.resolve({ id: 2, name, items: [] });
    },

    updateList(userId, id, name) {
      // Simulate updating a list (successful update)
      existingList.name = name;
      return Promise.resolve(existingList);
    },

    removeList(userId, id) {
      // Simulate removing a list (successful removal)
      return Promise.resolve(existingList);
    },

    addItemToList(userId, listId, item) {
      // Simulate adding an item to the list (successful addition)
      item.id = 10;
      return Promise.resolve(item);
    },

    updateItemFromList(userId, listId, itemId, partialItem) {
      // Simulate updating an item in the list (successful update)
      partialItem.id = itemId;
      return Promise.resolve(partialItem);
    },

    removeItemFromList(userId, listId, itemId) {
      // Simulate removing an item from the list (successful removal)
      const itemRemoved = { id: itemId, name: 'Milk', quantity: 1, bought: false };
      return Promise.resolve(itemRemoved);
    }
  };
}
