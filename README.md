# Shopping Lists App

A web application for creating and managing shopping lists, developed for the APW (Web Programming and Architecture) course at ISEL (LEIC 33D/34D, 2026/27).

## Features

- Get all shopping lists.
- Get, create, edit and remove a shopping list.
- Add, update partially and remove items from a list.
- Requests and responses must be in JSON format.

## Application Resources

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
