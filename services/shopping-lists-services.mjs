import Errors from '../commons/errors.mjs';

// --------- Shopping lists services ---------

export default function createShoppingListsServices(data) {

  // Check if the data module is provided
  if (!data) {
    throw new Error('The data module is required in Shopping Lists Services');
  }

  // Return the service functions
  return {
    getLists,
    getList,
    createNewList,
    updateList,
    removeList,
    addItemToList,
    updateItemFromList,
    removeItemFromList
  };

  // Get all shopping lists
  function getLists(userId){
    console.log("Getting all lists for user:", userId);

    return withRequired({ userId }, () => {
      // Get the lists from the data module
      return data.getLists(userId);
    });
  }

  // Get a shopping list by id
  function getList(userId, id){
    console.log(`Getting list of id ${id} for user ${userId}`);

    return withRequired({ userId, id }, () => {
      // Get the list from the data module by id. If it does not exist, the Promise is rejected.
      return data.getList(userId, id);
    });
  }

  // Create a new shopping list
  function createNewList(userId, listName){

    console.log(`Creating a new list for user ${userId} with name:`, listName);

    return withRequired({ userId }, () => {
      if (! listNameIsValid(listName)){
        return Promise.reject(Errors.INVALID_PARAMETER('name', 'The name of the list is required'));
      }
      return data.createNewList(userId, listName.trim());
    });
  }

  // Update a shopping list with a name
  function updateList(userId, id, name){

    console.log(`Updating list of id ${id} for user ${userId} with new name:`, name);

    return withRequired({ userId, id }, () => {
      if (! listNameIsValid(name)){
        return Promise.reject(Errors.INVALID_PARAMETER('name', 'The name of the list is required'));
      }

      return data.updateList(userId, id, name.trim());
    });
  }

  // Remove a shopping list by id
  function removeList(userId, id){

    console.log(`Deleting list of id ${id} for user ${userId}`);

    return withRequired({ userId, id }, () => {
      return data.removeList(userId, id);
    });
  }

  // ---- Items in a list ----

  // Add item to a specific shopping list
  function addItemToList(userId, idList, newItem){

    console.log("Adding item to list of id:", idList);

    return withRequired({ userId, idList }, () => {
      
      // Validate the new item before adding it to the list
      const validationError = validateNewItem(newItem);
      if (validationError){
        return Promise.reject(validationError);
      }

      return data.addItemToList(userId, idList, newItem);
    });
  }

  // Partially update an item of a shopping list
  function updateItemFromList(userId, listId, itemId, partialItem){

    console.log("Updating item of id:", itemId, "in list:", listId);

    return withRequired({ userId, listId, itemId }, () => {
      const validationError = validatePartialItem(partialItem);
      if (validationError){
        return Promise.reject(validationError);
      }

      return data.updateItemFromList(userId, listId, itemId, partialItem);
    });
  }

  // Remove an item from a shopping list
  function removeItemFromList(userId, listId, itemId){

    console.log("Deleting item of id:", itemId, "from list:", listId);

    return withRequired({ userId, listId, itemId }, () => {
      return data.removeItemFromList(userId, listId, itemId);
    }); 
  }

}

// --------- Helper functions ---------

// Returns an InternalError for the first parameter that is undefined or null, otherwise null.
function checkRequired(params){
  for (const [name, value] of Object.entries(params)){
    if (value === undefined || value === null){
      return Errors.INVALID_PARAMETER(name, `The ${name} is required`);
    }
  }
  return null;
}

// Executes the action if all required parameters are present, otherwise returns a Promise rejected with an InternalError.
function withRequired(params, action) {
    const error = checkRequired(params);
    return error ? Promise.reject(error) : action();
}

// --------- Validation functions ---------

// Returns true if the list name is valid, otherwise false.
function listNameIsValid(name){
  return typeof name === 'string' && name.trim() !== '';
}

// Returns true if the quantity is valid, otherwise false.
function quantityIsValid(quantity){
  return Number.isInteger(quantity) && quantity >= 1;
}

// Validate a partial item. Returns an InternalError if it is invalid, otherwise null.
function validatePartialItem(partialItem){
  const fields = ['name', 'quantity', 'bought'];

  if (!partialItem || !fields.some(field => field in partialItem)){
    return Errors.INVALID_PARAMETER('item', 'The item must have at least one of the properties: name, quantity or bought');
  }

  if ('name' in partialItem && (typeof partialItem.name !== 'string' || partialItem.name.trim() === '')){
    return Errors.INVALID_PARAMETER('name', 'The name of the item must be a non-empty string');
  }

  if ('quantity' in partialItem && !quantityIsValid(partialItem.quantity)){
    return Errors.INVALID_PARAMETER('quantity', 'The quantity of the item must be an integer greater than or equal to 1');
  }

  if ('bought' in partialItem && typeof partialItem.bought !== 'boolean'){
    return Errors.INVALID_PARAMETER('bought', 'The bought status of the item must be a boolean value');
  }

  return null;
}

// Validate a new item: name is required, quantity and bought are optional.
// Returns an InternalError if it is invalid, otherwise null.
function validateNewItem(newItem){
  if (typeof newItem?.name !== 'string' || newItem.name.trim() === ''){
    return Errors.INVALID_PARAMETER(
      'name', 
      'The name of the item is required and must be a non-empty string'
    );
  }

  if ('quantity' in newItem && !quantityIsValid(newItem.quantity)){
    return Errors.INVALID_PARAMETER(
      'quantity', 
      'The quantity of the item must be an integer greater than or equal to 1'
    );
  }

  if ('bought' in newItem && typeof newItem.bought !== 'boolean'){
    return Errors.INVALID_PARAMETER(
      'bought', 
      'The bought status of the item must be a boolean value'
    );
  }

  return null;
}
