import * as services from '../../services/shopping-lists-services.mjs';
import wrapperHandler from './handler-request-response.mjs';
import { InternalError } from '../../commons/errors.mjs';

// Operations on shopping lists and items in a list using the wrapperHandler function
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

  // Get the lists from the service
  const ret = services.getLists(req.user.id);

  // In case of success, return the lists as a JSON response
  if (ret.constructor !== InternalError){
    const lists = ret;
    return {lists: lists};
  }
  return ret;
}

// Get a list by id
function getListInternal(req, res){

  // Get the list from the service by id
  return services.getList(req.user.id, req.params.id);
}

// Create a new list
function createListInternal(req, res){

  // Create a new list using the service
  const ret = services.createNewList(req.user.id, req.body?.name);

  // In case of success, return a message indicating that the list was created
  if (ret.constructor !== InternalError){
    const newList = ret;
    res.status(201);
    return {
      message: `List id ${newList.id} was added!`,
      list: newList
    };
  }

  return ret;
}

// Update a list by id
function updateListInternal(req, res){

  // Update the list using the service
  const ret = services.updateList(req.user.id, req.params.id, req.body?.name);

  // In case of success, return a message indicating that the list was updated
  if (ret.constructor !== InternalError){
    const list = ret;
    return {
      message: `List with id ${req.params.id} updated.`, 
      list: list
    };
  }
  
  return ret;
}

// Delete a list by id
function deleteListInternal(req, res){

  // Remove the list using the service
  const ret = services.removeList(req.user.id, req.params.id);

  // In case of success, return a message indicating that the list was deleted
  if (ret.constructor !== InternalError){
    const deletedList = ret;
    return {
      message: `List with id ${req.params.id} deleted.`,
      list: deletedList
    };
  }

  return ret;
}

// ---- Items in a list ----

// Add an item to a list
function addItemInternal(req, res){

  // Add an item to the list using the service
  const ret = services.addItemToList(req.user.id, req.params.id, req.body);

  // In case of success, return a message indicating that the item was added
  if (ret.constructor !== InternalError){
    const item = ret;
    res.status(201);
    return {
      message: `Item id ${item.id} was added to list ${req.params.id}!`,
      item: item
    };
  }

  return ret;
}

// Partially update an item of a list
function updateItemInternal(req, res){

  // Update the item in the list using the service
  const ret = services.updateItemFromList(req.user.id, req.params.id, req.params.itemId, req.body);

  // In case of success, return a message indicating that the item was updated
  if (ret.constructor !== InternalError){
    const item = ret;
    return {
      message: `Item with id ${item.id} updated.`, 
      item: item
    };
  }

  return ret;
}

// Delete an item from a list
function deleteItemInternal(req, res){

  // Remove the item from the list using the service
  const ret = services.removeItemFromList(req.user.id, req.params.id, req.params.itemId);

  // In case of success, return a message indicating that the item was deleted
  if (ret.constructor !== InternalError){
    const deletedItem = ret;
    return {
      message: `Item with id ${deletedItem.id} deleted.`,
      item: deletedItem
    };
  }

  return ret;
}
