import express from 'express';
import wrapperHandler from './helpers.mjs';
import createBearerAuthMiddleware from '../auth-middleware.mjs';

export default function createShoppingListsApi(shoppingListsServices, usersServices) {

  if (!shoppingListsServices) {
    throw new Error('The Shopping Lists services module is required in Shopping Lists API');
  }

  if (!usersServices) {
    throw new Error('The Users services module is required in Shopping Lists API');
  }

  const router = express.Router();

  // Middleware to parse JSON request bodies and handle authentication
  router.use(express.json());

  // Middleware to handle authentication using Bearer tokens
  router.use(createBearerAuthMiddleware(usersServices));

  // Define the routes for the shopping lists API
  router.get('/lists', wrapperHandler(getListsInternal));
  router.get('/lists/:id', wrapperHandler(getListInternal));
  router.post('/lists', wrapperHandler(createListInternal));
  router.put('/lists/:id', wrapperHandler(updateListInternal));
  router.delete('/lists/:id', wrapperHandler(deleteListInternal));
  router.post('/lists/:id/items', wrapperHandler(addItemInternal));
  router.patch('/lists/:id/items/:itemId', wrapperHandler(updateItemInternal));
  router.delete('/lists/:id/items/:itemId', wrapperHandler(deleteItemInternal));

  return router;

  // Get all lists
  function getListsInternal(req, res){

    // Get the lists from the service and return them as a JSON response
    return shoppingListsServices.getLists(req.user.id)
      .then(lists => ({ lists: lists }));
  }

  // Get a list by id
  function getListInternal(req, res){

    // Get the list from the service by id
    return shoppingListsServices.getList(req.user.id, req.params.id);
  }

  // Create a new list
  function createListInternal(req, res){

    // Create a new list using the service
    return shoppingListsServices.createNewList(req.user.id, req.body?.name)
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
    return shoppingListsServices.updateList(req.user.id, req.params.id, req.body?.name)
      .then(list => ({
        // Return a message indicating that the list was updated
        message: `List with id ${req.params.id} updated.`,
        list: list
      }));
  }

  // Delete a list by id
  function deleteListInternal(req, res){

    // Remove the list using the service
    return shoppingListsServices.removeList(req.user.id, req.params.id)
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
    return shoppingListsServices.addItemToList(req.user.id, req.params.id, req.body)
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
    return shoppingListsServices.updateItemFromList(req.user.id, req.params.id, req.params.itemId, req.body)
      .then(item => ({
        // Return a message indicating that the item was updated
        message: `Item with id ${item.id} updated.`,
        item: item
      }));
  }

  // Delete an item from a list
  function deleteItemInternal(req, res){

    // Remove the item from the list using the service
    return shoppingListsServices.removeItemFromList(req.user.id, req.params.id, req.params.itemId)
      .then(deletedItem => ({
        // Return a message indicating that the item was deleted
        message: `Item with id ${deletedItem.id} deleted.`,
        item: deletedItem
      }));
  }

}
