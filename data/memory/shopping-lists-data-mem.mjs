import ERRORS, { InternalError } from '../../commons/errors.mjs';
import itemFactory from './item-factory.mjs';
import shoppingListFactory from './shopping-list-factory.mjs';

// This modules represents services + data
// TODO: separate service module from data module.
// TODO: define a interface between web api and service. 

// DATA in memory: shopping lists and items
const USER_LISTS = {
    1: [
        shoppingListFactory.create('Grocery Shopping', [
            itemFactory.create('Milk', 2, false), 
            itemFactory.create('Bread', 1, true), 
            itemFactory.create('Eggs', 12, false)] ),
        shoppingListFactory.create('Weekly Meal Prep', [
            itemFactory.create('Chicken Breast', 2, true), 
            itemFactory.create('Rice', 1, false), 
            itemFactory.create('Vegetables', 3, false), 
            itemFactory.create('Olive Oil', 1, true)] ),
        shoppingListFactory.create('Office Supplies', [
            itemFactory.create('Printer Paper', 5, false),
            itemFactory.create('Pens', 10, true),
            itemFactory.create('Notepads', 2, false)
        ])
    ],
    2: [
        shoppingListFactory.create('Hardware Store', [
            itemFactory.create('Hammer', 1, false),
            itemFactory.create('Nails', 100, true)
        ]),
        shoppingListFactory.create('Home Improvement', [
            itemFactory.create('Paint', 2, false),
            itemFactory.create('Brushes', 3, true),
            itemFactory.create('Screws', 50, false)
        ]),
        shoppingListFactory.create('Garden Tools', [
            itemFactory.create('Shovel', 1, true),
            itemFactory.create('Rake', 1, false),
            itemFactory.create('Gloves', 2, true),
            itemFactory.create('Seeds', 4, false)
        ])
    ],
    3: []
};

// Get all lists
export function getLists(userId){

  // Return the USER_LISTS array from the user id
  return USER_LISTS[userId] || [];
}

// Get a list by id
export function getList(userId, id){

  // Find the list with the specified id in the USER_LISTS array of a user
  const list = (USER_LISTS[userId] || []).find(list => list.id == id);
  
  if (!list){
    return ERRORS.LIST_NOT_FOUND(id);
  }

  return list;
}

// Create a new list
export function createNewList(userId, listName){

  // Initialize the USER_LISTS array for the user if it doesn't exist
  if (!USER_LISTS[userId]){
    USER_LISTS[userId] = [];
  }

  // Create a new list object with a unique id and an empty items array
  const newList = shoppingListFactory.create(listName);

  // Add the new list to the USER_LISTS array
  USER_LISTS[userId].push(newList);

  // Return the newly created list
  return newList;
}

// Update a list with a name
export function updateList(userId, id, name){


  // Find the index of the list with the specified id in the USER_LISTS array
    const listIndex = (USER_LISTS[userId] || []).findIndex(list => list.id == id);

  // If the list is not found, return error code for list not found
  if (listIndex === -1){
    return ERRORS.LIST_NOT_FOUND(id);
  }

  // Update the name of the list
  USER_LISTS[userId][listIndex].name = name;

  // Return the updated list
  return USER_LISTS[userId][listIndex];
}

// Remove a list by id
export function removeList(userId, id){

  // Find the index of the list with the specified id in the USER_LISTS array
  const listIndex = (USER_LISTS[userId] || []).findIndex(list => list.id == id);
  
  if (listIndex == -1){
    return ERRORS.LIST_NOT_FOUND(id);
  }

  // Remove the list from the USER_LISTS array
  const list = USER_LISTS[userId][listIndex];
  USER_LISTS[userId].splice(listIndex, 1);

  // Return the removed list
  return list;
}

// ---- Items in a list ----

// Add item to a specific list
export function addItemToList(userId, idList, newItem){

  const ret = getList(userId, idList);

  // TODO: use an appropriate error handling mechanism.
  if (ret.constructor === InternalError){
    return ret;
  }

  const list = ret;

  const item = itemFactory.create(newItem.name, newItem.quantity, newItem.bought);
  list.items.push(item);

  // Return the newly added item
  return item;
}

// Partially update an item of a list
export function updateItemFromList(userId, listId, itemId, partialItem){
  
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
