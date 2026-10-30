import ERRORS, { InternalError } from '../commons/errors.mjs';
// This modules represents services + data
// TODO: separate service module from data module.
// TODO: define a interface between web api and service. 

// DATA in memory: shopping lists and items
const SHOPPING_LISTS = {
  1: [
    {
      id: 1,
      name: 'Grocery Shopping',
      items: [
        { id: 1, name: 'Milk', quantity: 2, bought: false },
        { id: 2, name: 'Bread', quantity: 1, bought: true },
        { id: 3, name: 'Eggs', quantity: 12, bought: false }
      ]
    },
    {
      id: 2,
      name: 'Office Supplies',
      items: [
        { id: 1, name: 'Printer Paper', quantity: 5, bought: false },
        { id: 2, name: 'Pens', quantity: 10, bought: true },
        { id: 3, name: 'Notepads', quantity: 2, bought: false }
      ]
    }
  ],
  2: [
    {
      id: 1,
      name: 'Party Supplies',
      items: [
        { id: 1, name: 'Balloons', quantity: 20, bought: false },
        { id: 2, name: 'Streamers', quantity: 5, bought: true },
        { id: 3, name: 'Confetti', quantity: 1, bought: false }
      ]
    },
    {
      id: 2,
      name: 'Gifts',
      items: [
        { id: 1, name: 'Chocolate', quantity: 1, bought: false },
        { id: 2, name: 'Flowers', quantity: 1, bought: false },
        { id: 3, name: 'Candles', quantity: 3, bought: false }
      ]
    }
  ],
  3: []
};

// Current ID for new shopping lists for each user, initialized to the next available ID based on existing lists
// TODO: This is a temporary solution. A better approach should be to implement a proper ID generation mechanism with
// a shopping list factory or a database that handles unique IDs automatically.
let currentIdObject = Object.entries(SHOPPING_LISTS)
                      .map(([userId, lists]) => [userId, lists.length + 1]);
currentIdObject = Object.fromEntries(currentIdObject);

// Validate a list name. Returns an InternalError if it is invalid, otherwise null.
function validateListName(name){
  if (typeof name !== 'string' || name.trim() === ''){
    return ERRORS.INVALID_PARAMETER(
      'name', 
      'The name of the list is required and must be a non-empty string'
    );
  }

  return null;
}

// Get all lists
export function getLists(userId){
  console.log("Getting all lists for user:", userId);

  // Return the SHOPPING_LISTS array from the user id
  return SHOPPING_LISTS[userId] || [];
}

// Get a list by id
export function getList(userId, id){

  // Find the list with the specified id in the SHOPPING_LISTS array of a user
  const list = (SHOPPING_LISTS[userId] || []).find(list => list.id == id);

  // If the list is not found, return error code for list not found
  if (! list){
    return ERRORS.LIST_NOT_FOUND(id);
  }

  return list;
}

// Create a new list
export function createNewList(userId, listName){

  console.log(`Creating a new list for user ${userId} with name:`, listName);

  // Validate the request body for the new list
  const validationError = validateListName(listName);
  if (validationError){
    return validationError;
  }

  // Initialize the SHOPPING_LISTS array for the user if it doesn't exist
  if (!SHOPPING_LISTS[userId]){
    SHOPPING_LISTS[userId] = [];
    currentIdObject[userId] = 1; // Initialize the currentId for the user if it doesn't exist
  }

  // Create a new list object with a unique id and an empty items array
  const newList = {
    id: currentIdObject[userId], // Use the currentId for the user or default to 1
    name: listName.trim(),
    items: []
  }

  // Add the new list to the SHOPPING_LISTS array
  // and increment the currentId for the next list
  SHOPPING_LISTS[userId].push(newList);
  currentIdObject[userId]++;

  // Return the newly created list
  return newList;
}

// Update a list with a name
export function updateList(userId, id, name){

  console.log(`Updating list of id ${id} for user ${userId} with new name:`, name);

  // Find the index of the list with the specified id in the SHOPPING_LISTS array
  const listIndex = (SHOPPING_LISTS[userId] || []).findIndex(list => list.id == id);

  if (listIndex == -1){
    return ERRORS.LIST_NOT_FOUND(id);
  }

  const validationError = validateListName(name);
  if (validateListName(name)){
    return validationError;
  }

  // Update the list name
  SHOPPING_LISTS[userId][listIndex].name = name.trim();

  // Return the updated list
  return SHOPPING_LISTS[userId][listIndex];
}

// Remove a list by id
export function removeList(userId, id){

  console.log(`Deleting list of id ${id} for user ${userId}`);

  // Find the index of the list with the specified id in the SHOPPING_LISTS array
  const listIndex = (SHOPPING_LISTS[userId] || []).findIndex(list => list.id == id);
  
  if (listIndex == -1){
    return ERRORS.LIST_NOT_FOUND(id);
  }

  // Remove the list from the SHOPPING_LISTS array
  const list = SHOPPING_LISTS[userId][listIndex];
  SHOPPING_LISTS[userId].splice(listIndex, 1);

  // Return the removed list
  return list;
}

// ---- Items in a list ----

function isValidQuantity(quantity){
  return Number.isInteger(quantity) && quantity >= 1;
}

// Validate a partial item. Returns an InternalError if it is invalid, otherwise null.
function validatePartialItem(partialItem){
  const fields = ['name', 'quantity', 'bought'];

  if (!partialItem || !fields.some(field => field in partialItem)){
    return ERRORS.INVALID_PARAMETER('item', 'The item must have at least one of the properties: name, quantity or bought');
  }

  if ('name' in partialItem && (typeof partialItem.name !== 'string' || partialItem.name.trim() === '')){
    return ERRORS.INVALID_PARAMETER('name', 'The name of the item must be a non-empty string');
  }

  if ('quantity' in partialItem && !isValidQuantity(partialItem.quantity)){
    return ERRORS.INVALID_PARAMETER('quantity', 'The quantity of the item must be an integer greater than or equal to 1');
  }

  if ('bought' in partialItem && typeof partialItem.bought !== 'boolean'){
    return ERRORS.INVALID_PARAMETER('bought', 'The bought status of the item must be a boolean value');
  }

  return null;
}

// Validate a new item: name is required, quantity and bought are optional.
// Returns an InternalError if it is invalid, otherwise null.
function validateNewItem(newItem){
  if (typeof newItem?.name !== 'string' || newItem.name.trim() === ''){
    return ERRORS.INVALID_PARAMETER(
      'name', 
      'The name of the item is required and must be a non-empty string'
    );
  }

  if ('quantity' in newItem && !isValidQuantity(newItem.quantity)){
    return ERRORS.INVALID_PARAMETER(
      'quantity', 
      'The quantity of the item must be an integer greater than or equal to 1'
    );
  }

  if ('bought' in newItem && typeof newItem.bought !== 'boolean'){
    return ERRORS.INVALID_PARAMETER(
      'bought', 
      'The bought status of the item must be a boolean value'
    );
  }

  return null;
}

// Add item to a specific list
export function addItemToList(userId, idList, newItem){

  console.log("Adding item to list of id:", idList);

  const ret = getList(userId, idList);

  // TODO: use an appropriate error handling mechanism.
  if (ret.constructor === InternalError){
    return ret;
  }

  const list = ret;

  const validationError = validateNewItem(newItem);
  if (validationError){
    return validationError;
  }

  // New item id is the next integer after the highest existing item id in the list
  const newItemId = list.items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

  // Create the new item with a unique id within the list
  const item = {
    id: newItemId,
    name: newItem.name.trim(), // required field
    quantity: newItem.quantity ?? 1, // defaults to 1 when quantity is undefined or null
    bought: newItem.bought ?? false
  }
  list.items.push(item);

  // Return the newly added item
  return item;
}

// Partially update an item of a list
export function updateItemFromList(userId, listId, itemId, partialItem){

  console.log("Updating item of id:", itemId, "in list:", listId);
  
  const ret = getList(userId, listId);

  // TODO: use an appropriate error handling mechanism.
  if (ret.constructor === InternalError){
    return ret;
  }

  const list = ret;

  // Find the index of the item with the specified itemId in the list's items array
  const itemIndex = list.items.findIndex(item => item.id == itemId);
  if (itemIndex == -1){
    return ERRORS.ITEM_NOT_FOUND(itemId);
  }

  const validationError = validatePartialItem(partialItem);
  if (validationError){
    return validationError;
  }

  // The partial item is valid, so it is safe to update the item
  if ('name' in partialItem)
    list.items[itemIndex].name = partialItem.name.trim();
  if ('quantity' in partialItem)
    list.items[itemIndex].quantity = partialItem.quantity;
  if ('bought' in partialItem)
    list.items[itemIndex].bought = partialItem.bought;

  // Return the updated item
  return list.items[itemIndex];
}

// Remove an item from a list
export function removeItemFromList(userId, listId, itemId){

  console.log("Deleting item of id:", itemId, "from list:", listId);

  const ret = getList(userId, listId);

  // TODO: use an appropriate error handling mechanism.
  if (ret.constructor === InternalError){
    return ret;
  }

  const list = ret;

  // Find the index of the item with the specified itemId in the list's items array
  const itemIndex = list.items.findIndex(item => item.id == itemId);
  if (itemIndex == -1){
    return ERRORS.ITEM_NOT_FOUND(itemId);
  }

  // Remove the item from the list
  const item = list.items[itemIndex];
  list.items.splice(itemIndex, 1);

  // Return the removed item
  return item;
}
