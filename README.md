# Shopping Lists App

A web application for creating and managing shopping lists, developed for the APW (Web Programming and Architecture) course at ISEL (LEIC 33D/34D, 2026/27).

## Features

- Create a user.
- Authenticate requests with an API token (Bearer).
- Get all shopping lists.
- Get, create, edit and remove a shopping list.
- Add, update partially and remove items from a list.
- Requests and responses must be in JSON format.
- Each user only accesses their own shopping lists.

## Application Resources

- `/api/users`
    - POST (create a user, no authentication required)
- `/api/lists`
    - GET (get all shopping lists)
    - POST (create a shopping list)
- `/api/lists/:id`
    - GET (get a specific shopping list)
    - PUT (edit a shopping list)
    - DELETE (remove a shopping list)
- `/api/lists/:id/items`
    - POST (create an item in a shopping list)
- `/api/lists/:id/items/:itemId`
    - DELETE (remove an item from a shopping list)
    - PATCH (partial update of an item in a shopping list)

## Authentication

All resources, except `POST /api/users`, require the header `Authorization: Bearer <apiToken>`. The `apiToken` is returned when a user is created.

## API Documentation

The OpenAPI specification is in `docs/openapi.yaml`. Swagger UI is available at `http://localhost:8000/api-docs`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- npm

### Installation

```bash
git clone <repository-url>
cd 2627-leic33D-34D-shopping-lists-app
npm install
```

### Running the Application

```bash
npm run start
```

The application will be available at `http://localhost:8000`.

## License

This project is for academic purposes.
