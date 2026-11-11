import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import createShoppingListsApi from './web/api/shopping-lists-api.mjs';
import createUsersApi from './web/api/users-api.mjs';
import createShoppingListsServices from './services/shopping-lists-services.mjs';
import createUsersServices from './services/users-services.mjs';
import shoppingListsData from './data/memory/shopping-lists-data-mem.mjs';
import usersData from './data/memory/users-data-mem.mjs';

// Create the services and APIs for shopping lists and users
let usersServices;
let shoppingListsServices;
let shoppingListsApi;
let usersApi;

try {
  usersServices = createUsersServices(usersData);
  shoppingListsServices = createShoppingListsServices(shoppingListsData);
  shoppingListsApi = createShoppingListsApi(shoppingListsServices, usersServices);
  usersApi = createUsersApi(usersServices);
} catch (error) {
  console.error('Error creating services or APIs:', error);
  process.exit(1);
}

// WARNING:
// This is a version of Shopping Lists Web Application.
// - Lists and users are in memory (in data);
//    - Without persistent storage (no database);
// - Without centralised server error handling.
// - No integration tests;
// - No end-to-end tests (only manual tests with browser and Rest Client);

const PORT = 8000;  // Port number for the tests

// Load the OpenAPI specification from the YAML file
const swaggerDocs = yaml.load('./docs/openapi.yaml');

// Create an Express application
const app = express(); // Express function returns an app

// Serve the OpenAPI specification and Swagger UI for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to parse JSON request bodies
app.use(express.json());

// This route is for creating a new user (registration)
// There is no authentication required for this route, as it is for new users to register
app.post('/api/users', usersApi.createUser);

// Routes:

// GET /api/lists - Get all shopping lists
app.get('/api/lists', shoppingListsApi.getLists);

// GET /api/lists/:id - Get a specific shopping list by ID
app.get('/api/lists/:id', shoppingListsApi.getList);

// POST /api/lists - Create a new shopping list
app.post('/api/lists', shoppingListsApi.createList);

// PUT /api/lists/:id - Update an existing shopping list by ID
app.put('/api/lists/:id', shoppingListsApi.updateList);

// DELETE /api/lists/:id - Delete a shopping list by ID
app.delete('/api/lists/:id', shoppingListsApi.deleteList);

// POST /api/lists/:id/items - Add an item to a specific shopping list
app.post('/api/lists/:id/items', shoppingListsApi.addItem);

// PATCH /api/lists/:id/items/:itemId - Partial update an item in a specific shopping list
app.patch('/api/lists/:id/items/:itemId', shoppingListsApi.updateItem);

// DELETE /api/lists/:id/items/:itemId - Delete an item from a specific shopping list
app.delete('/api/lists/:id/items/:itemId', shoppingListsApi.deleteItem);

// App listening...
app.listen(PORT, () => {
  console.log(`Shopping Lists app listening at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});