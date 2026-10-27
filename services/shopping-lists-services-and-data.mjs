import ERRORS from '../commons/errors.mjs';
// This modules represents services + data
// TODO: separate service module from data module.
// TODO: define a interface between web api and service. 

// DATA in memory: shopping lists and items
const SHOPPING_LISTS = [
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
];

// Current ID for new shopping lists
let currentId = SHOPPING_LISTS.length + 1;

// Get all lists
export function getLists(){
  console.log("Getting all lists");

  // If there are no shopping lists, return an error code for lists not found
  if (SHOPPING_LISTS.length === 0) {
    return ERRORS.LISTS_NOT_FOUND();
  }

  // Return the SHOPPING_LISTS array
  return SHOPPING_LISTS;
}

// Get a list by id
export function getList(id){
  console.log("Getting list of id:", id);

  // Find the list with the specified id in the SHOPPING_LISTS array
  const list = SHOPPING_LISTS.find(list => list.id == id);

  // If the list is not found, return error code for list not found
  if (! list){
    return ERRORS.LIST_NOT_FOUND(id);
  }

  return list;
}

// Create a new list
export function createNewList(listName){
  console.log("Adding list with name:");
  console.log(listName);

  // Validate the request body for the new list
  if (typeof listName !== 'string' || listName.trim() === ''){
    console.error('Invalid parameter: name. The name of the list is required and must be a non-empty string.');
    return ERRORS.INVALID_PARAMETER('name', 'The name of the list is required and must be a non-empty string');
  }

  // Create a new list object with a unique id and an empty items array
  const newList = {
    id: currentId,
    name: listName.trim(),
    items: []
  }
  // Add the new list to the SHOPPING_LISTS array
  // and increment the currentId for the next list
  SHOPPING_LISTS.push(newList);
  currentId++;

  // Return the newly created list
  return newList;
}

// Update a list with a name
export function updateList(id, name){

  console.log("Updating list of id:", id);

  // Find the index of the list with the specified id in the SHOPPING_LISTS array
  const listIndex = SHOPPING_LISTS.findIndex(list => list.id == id);

  if (listIndex == -1){
    return ERRORS.LIST_NOT_FOUND(id);
  }

  if (typeof name != 'string' || name.trim() === ''){
    return ERRORS.INVALID_PARAMETER('name', 'The name of the list is required and must be a non-empty string');
  }

  // Update the list name
  SHOPPING_LISTS[listIndex].name = name.trim();

  // Return the updated list
  return SHOPPING_LISTS[listIndex];
}

// Remove a list by id
export function removeList(id){

  console.log("Deleting list of id:", id);

  // Find the index of the list with the specified id in the SHOPPING_LISTS array
  const listIndex = SHOPPING_LISTS.findIndex(list => list.id == id);
  
  if (listIndex == -1){
    return ERRORS.LIST_NOT_FOUND(id);
  }

  // Remove the list from the SHOPPING_LISTS array
  const list = SHOPPING_LISTS[listIndex];
  SHOPPING_LISTS.splice(listIndex, 1);

  // Return the removed list
  return list;
}

// ---- Items in a list ----

// Add item to a specific list
export function addItemToList(idList, newItem){

  console.log("Adding item to list of id:", idList);

  // Find the list with the specified id in the SHOPPING_LISTS array
  const list = SHOPPING_LISTS.find(list => list.id == idList);
  
  if (!list){
    // Return null to indicate that the list was not found
    return ERRORS.LIST_NOT_FOUND(idList);
  }

  // Validate the request body for the new item: 
  // name is required, quantity is optional (default 1), bought is optional (default false)

  if (typeof newItem?.name !== 'string' || newItem?.name.trim() === ''){
    // Return null to indicate that the item name is invalid
    return ERRORS.INVALID_PARAMETER(
      'name', 
      'The name of the item is required and must be a non-empty string'
    );
  }

  if ('quantity' in newItem && !(Number(newItem.quantity) > 0)){
    // Return null to indicate that the item quantity is invalid
    return ERRORS.INVALID_PARAMETER('quantity', 'The quantity of the item must be a positive number');
  }

  if ('bought' in newItem && typeof newItem.bought !== 'boolean'){
    // Return null to indicate that the item bought status is invalid
    return ERRORS.INVALID_PARAMETER('bought', 'The bought status of the item must be a boolean value');
  }

  // New item id is the next integer after the highest existing item id in the list
  const newItemId = list.items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;

  // Create the new item with a unique id within the list
  const item = {
    id: newItemId,
    name: newItem.name.trim(), // required field
    quantity: newItem.quantity || 1,
    bought: newItem.bought || false
  }
  list.items.push(item);

  // Return the newly added item
  return item;
}

// Partially update an item of a list
export function updateItemFromList(listId, itemId, partialItem){

  console.log("Updating item of id:", itemId, "in list:", listId);
  
  // Find the list with the specified id in the SHOPPING_LISTS array
  const list = SHOPPING_LISTS.find(list => list.id == listId);
  if (!list){
    return ERRORS.LIST_NOT_FOUND(listId);
  }

  // Find the index of the item with the specified itemId in the list's items array
  const itemIndex = list.items.findIndex(item => item.id == itemId);
  if (itemIndex == -1){
    return ERRORS.ITEM_NOT_FOUND(itemId);
  }

  // TODO: Need to validate the request body for the item update
  if ("name" in partialItem)
    list.items[itemIndex].name = partialItem.name;
  if ("quantity" in partialItem)
    list.items[itemIndex].quantity = partialItem.quantity;
  if ("bought" in partialItem)
    list.items[itemIndex].bought = partialItem.bought;

  // Return the updated item
  return list.items[itemIndex];
}

// Remove an item from a list
export function removeItemFromList(listId, itemId){

  console.log("Deleting item of id:", itemId, "from list:", listId);

  // Find the list with the specified id in the SHOPPING_LISTS array
  const list = SHOPPING_LISTS.find(list => list.id == listId);
  if (!list){
    return ERRORS.LIST_NOT_FOUND(listId);
  }

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
