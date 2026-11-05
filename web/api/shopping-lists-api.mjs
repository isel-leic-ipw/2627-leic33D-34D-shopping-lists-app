import * as services from '../../services/shopping-lists-services.mjs';
import wrapperHandler from './helpers.mjs';

// Operations on shopping lists and items in a list using the wrapperHandler function.
// Each internal handler returns a Promise: resolved with the response body or rejected with an InternalError.
export const getLists = wrapperHandler(getListsInternal);
export const getList = wrapperHandler(getListInternal);
export const createList = wrapperHandler(createListInternal);
export const updateList = wrapperHandler(updateListInternal);
export const deleteList = wrapperHandler(deleteListInternal);
export const addItem = wrapperHandler(addItemInternal);
export const updateItem = wrapperHandler(updateItemInternal);
export const deleteItem = wrapperHandler(deleteItemInternal);

// Get all lists
function getListsInternal(req, res){

  // Get the lists from the service and return them as a JSON response
  return services.getLists(req.user.id)
    .then(lists => ({ lists: lists }));
}

// Get a list by id
function getListInternal(req, res){

  // Get the list from the service by id
  return services.getList(req.user.id, req.params.id);
}

// Create a new list
function createListInternal(req, res){

  // Create a new list using the service
  return services.createNewList(req.user.id, req.body?.name)
    .then(newList => {
      // Return a message indicating that the list was created
      res.status(201);
      return {
        message: `List id ${newList.id} was added!`,
        list: newList
      };
    });
}

// Update a list by id
function updateListInternal(req, res){

  // Update the list using the service
  return services.updateList(req.user.id, req.params.id, req.body?.name)
    .then(list => ({
      // Return a message indicating that the list was updated
      message: `List with id ${req.params.id} updated.`,
      list: list
    }));
}

// Delete a list by id
function deleteListInternal(req, res){

  // Remove the list using the service
  return services.removeList(req.user.id, req.params.id)
    .then(deletedList => ({
      // Return a message indicating that the list was deleted
      message: `List with id ${req.params.id} deleted.`,
      list: deletedList
    }));
}

// ---- Items in a list ----

// Add an item to a list
function addItemInternal(req, res){

  // Add an item to the list using the service
  return services.addItemToList(req.user.id, req.params.id, req.body)
    .then(item => {
      // Return a message indicating that the item was added
      res.status(201);
      return {
        message: `Item id ${item.id} was added to list ${req.params.id}!`,
        item: item
      };
    });
}

// Partially update an item of a list
function updateItemInternal(req, res){

  // Update the item in the list using the service
  return services.updateItemFromList(req.user.id, req.params.id, req.params.itemId, req.body)
    .then(item => ({
      // Return a message indicating that the item was updated
      message: `Item with id ${item.id} updated.`,
      item: item
    }));
}

// Delete an item from a list
function deleteItemInternal(req, res){

  // Remove the item from the list using the service
  return services.removeItemFromList(req.user.id, req.params.id, req.params.itemId)
    .then(deletedItem => ({
      // Return a message indicating that the item was deleted
      message: `Item with id ${deletedItem.id} deleted.`,
      item: deletedItem
    }));
}
