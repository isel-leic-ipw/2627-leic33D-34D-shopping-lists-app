import * as services from '../../services/shopping-lists-services-and-data.mjs';
import mapToHttpError from '../map-to-http-errors.mjs';
import { InternalError } from '../../commons/errors.mjs';

// TODO: include a handler to avoid code repetition in all handlers.

// Get all lists
export function getLists(req, res){
  // Get the lists from the service
  const ret = services.getLists();

  if (ret.constructor === InternalError){
    const httpError = mapToHttpError(ret);
    res.status(httpError.status);
    res.json(httpError.error);
    return;
  }

  // Return the lists from the service as JSON response
  const lists = ret;
  res.json({lists: lists});
}

// Get a list by id
export function getList(req, res){

  // Get the list from the service by id
  const ret = services.getList(req.params.id);

  // If the returned value is an error response, send the appropriate HTTP status and message
  if (ret.constructor === InternalError){
    const httpError = mapToHttpError(ret);
    res.status(httpError.status);
    res.json(httpError.error);
    return;
  }

  // Otherwise, the list was found, so send it as a JSON response
  const list = ret;
  res.json(list);
}

// Create a new list
export function createList(req, res){

  // Create a new list using the service
  const ret = services.createNewList(req.body?.name);

  // If the returned value is an error response, send the appropriate HTTP status and message
  if (ret.constructor === InternalError){
    const httpError = mapToHttpError(ret);
    res.status(httpError.status);
    res.json(httpError.error);
    return;
  }

  // Otherwise, the list was created successfully, so send it as a JSON response
  const newList = ret;
  res.status(201);
  res.json({
    message: `List id ${newList.id} was added!`,
    list: newList
  });
}

// Update a list by id
export function updateList(req, res){

  // Update the list using the service
  const ret = services.updateList(req.params.id, req.body?.name);

  // If the returned value is an error response, send the appropriate HTTP status and message
  if (ret.constructor === InternalError){
    const httpError = mapToHttpError(ret);
    res.status(httpError.status);
    res.json(httpError.error);
    return;
  }

  // Otherwise, the list was updated successfully, so send it as a JSON response
  const list = ret;
  res.json({
    message: `List with id ${req.params.id} updated.`, 
    list: list
  });   
}

// Delete a list by id
export function deleteList(req, res){

  // Remove the list using the service
  const ret = services.removeList(req.params.id);

  // If the returned value is an error response, send the appropriate HTTP status and message
  if (ret.constructor === InternalError){
    const httpError = mapToHttpError(ret);
    res.status(httpError.status);
    res.json(httpError.error);
    return;
  }

  // Otherwise, the list was deleted successfully, so send it as a JSON response
  const deletedList = ret;
  res.json({
    message: `List with id ${req.params.id} deleted.`,
    list: deletedList
  });
}

// ---- Items in a list ----

// Add an item to a list
export function addItem(req, res){

  // Add an item to the list using the service
  const ret = services.addItemToList(req.params.id, req.body);
  // If the returned value is an error response, send the appropriate HTTP status and message
  if (ret.constructor === InternalError){
    const httpError = mapToHttpError(ret);
    res.status(httpError.status);
    res.json(httpError.error);
    return;
  }

  // Otherwise, the item was added successfully, so send it as a JSON response
  const item = ret;
  res.status(201);
  res.json({
    message: `Item id ${item.id} was added to list ${req.params.id}!`,
    item: item
  });
}

// Partially update an item of a list
export function updateItem(req, res){

  // Update the item in the list using the service
  const ret = services.updateItemFromList(req.params.id, req.params.itemId, req.body);

  // If the returned value is an error response, send the appropriate HTTP status and message
  if (ret.constructor === InternalError){
    const httpError = mapToHttpError(ret);
    res.status(httpError.status);
    res.json(httpError.error);
    return;
  }

  // Otherwise, the item was updated successfully, so send it as a JSON response
  const item = ret;
  res.json({
        message: `Item with id ${item.id} updated.`, 
        item: item
    });
}

// Delete an item from a list
export function deleteItem(req, res){

  // Remove the item from the list using the service
  const ret = services.removeItemFromList(req.params.id, req.params.itemId);

  // If the returned value is an error response, send the appropriate HTTP status and message
  if (ret.constructor === InternalError){
    const httpError = mapToHttpError(ret);
    res.status(httpError.status);
    res.json(httpError.error);
    return;
  }

  // Otherwise, the item was deleted successfully, so send it as a JSON response
  const deletedItem = ret;
  res.json({
    message: `Item with id ${deletedItem.id} deleted.`,
    item: deletedItem
  });
}
