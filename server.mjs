import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import * as api from './web/api/shopping-lists-api.mjs';
import * as userApi from './web/api/users-api.mjs';
import authMiddleware from './web/auth-middleware.mjs';

// WARNING:
// This is a very simple version of Shopping Lists Web Application.
// - Lists are in memory (in services);
// - There is a partial module organization;
//    - Missing data module (currently, services = services + data);
//    - Missing dependency injection;
// - Without asynchronous operations;
// - Without persistent storage (no database);
// - No unit tests;
// - No integration tests;
// - No end-to-end tests (only manual tests with browser and Rest Client);
// - Without improvements with middlewares, error handling, etc.

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
app.post('/api/users', userApi.createUser);

// Authenticate all API requests after this middleware
app.use('/api', authMiddleware);

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
app.listen(PORT, () => {
  console.log(`Shopping Lists app listening at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});