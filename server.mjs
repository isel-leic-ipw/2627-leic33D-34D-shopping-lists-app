import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import createShoppingListsApi from './web/api/shopping-lists-api.mjs';
import createUsersApi from './web/api/users-api.mjs';
import createShoppingListsServices from './services/shopping-lists-services.mjs';
import createUsersServices from './services/users-services.mjs';
import shoppingListsData from './data/memory/shopping-lists-data-mem.mjs';
import usersData from './data/memory/users-data-mem.mjs';
import { notFoundHandler, errorHandler } from './web/error-middleware.mjs';
import cors from 'cors';

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
// - No integration tests;
// - No end-to-end tests (only manual tests with browser and Rest Client);

const PORT = 8000;  // Port number for the tests

// Load the OpenAPI specification from the YAML file
const swaggerDocs = yaml.load('./docs/openapi.yaml');

// Create an Express application
const app = express(); // Express function returns an app

// Serve the OpenAPI specification and Swagger UI for API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Enable CORS for all API routes to allow cross-origin requests from any origin for a public API
app.use('/api', cors());

// Register API routes: users first (registration doesn't require authentication), then shopping lists
app.use('/api', usersApi);
app.use('/api', shoppingListsApi);

// Handle non-existent routes (404 Not Found)
// After all routes have been registered, this middleware will catch any requests to 
// unknown routes and pass a 404 error to the error handler.
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

// App listening...
app.listen(PORT, () => {
  console.log(`Shopping Lists app listening at http://localhost:${PORT}`);
  console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});
