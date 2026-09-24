# Snip

Snip is a tiny URL shortener built as a layered git-submodule project.

## Architecture

- backend: Bun API for creating and redirecting short links
- frontend: Angular 19 UI that calls the backend API
- cli: Node-based CLI for add/list/open commands

## API contract

The backend exposes the following contract on port 3000:

- POST /api/links { "url": "https://..." }
- GET /api/links
- GET /:code

## Workflow

1. Edit each submodule on its own branch
2. Push the submodule changes upstream
3. Update the main pointer with `git submodule update --remote <path>`
4. Release the bundle from the generated build script
