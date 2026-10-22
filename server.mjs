import express from 'express';
import * as api from './shopping-lists-api.mjs';

// WARNING:
// This is a very simple version of Shopping Lists Web Application.
// - Lists are in memory (in services);
// - Without Web API documentation;
// - There is a partial module organization;
//    - Missing a well-defined interface between the layered modules;
//    - Missing data module (currently, services = services + data);
//    - Missing dependency injection;
// - Without users and authentication;
// - Without asynchronous operations.

const PORT = 8000;  // Port number for the tests

// Create an Express application
const app = express(); // Express function returns an app

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes:

// GET /api/lists - Get all shopping lists
app.get('/api/lists', api.getLists);

// GET /api/lists/:id - Get a specific shopping list by ID
app.get('/api/lists/:id', api.getList);

// POST /api/lists - Create a new shopping list
app.post('/api/lists', api.createList);

// PUT /api/lists/:id - Update an existing shopping list by ID
app.put('/api/lists/:id', api.updateList);

// DELETE /api/lists/:id - Delete a shopping list by ID
app.delete('/api/lists/:id', api.deleteList);

// POST /api/lists/:id/items - Add an item to a specific shopping list
app.post('/api/lists/:id/items', api.addItem);

// PATCH /api/lists/:id/items/:itemId - Partial update an item in a specific shopping list
app.patch('/api/lists/:id/items/:itemId', api.updateItem);

// DELETE /api/lists/:id/items/:itemId - Delete an item from a specific shopping list
app.delete('/api/lists/:id/items/:itemId', api.deleteItem);


// App listening...
app.listen(PORT, () =>
  console.log(`Shopping Lists app listening on port ${PORT}!`),
);
