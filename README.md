# Auto Invoice Generator Backend

This folder contains the backend server for the Auto Invoice Generator.

## Setup

1.  **Install Node.js**: Ensure Node.js is installed on your system.
2.  **Install Dependencies**:
    Open a terminal in this folder and run:
    ```bash
    npm install
    ```
    (Note: If this fails, delete `package-lock.json` and try again).

## Running the Server

1.  Start the server:
    ```bash
    npm start
    ```
    or
    ```bash
    node server.js
    ```
2.  The application will be available at `http://localhost:3000`.

## Configuration
- Port is defined in `.env` file (default: 3000).
- `server.js` contains a basic in-memory database implementation for invoices. For persistence, integrate with MongoDB or a file-based DB.

## Changelog
See [CHANGELOG.md](CHANGELOG.md) for version history.
