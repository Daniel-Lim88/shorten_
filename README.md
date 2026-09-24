# Snip

Snip is a tiny URL shortener built as a layered git-submodule project: one Bun
backend serves the same API to an Angular web client and a Node CLI.

## Architecture

- backend: Bun API for creating and redirecting short links
- frontend: Angular 19 UI that calls the backend API
- cli: Node-based CLI for add/list/open commands
- bundle: generated release serving the API, redirects, and built UI together

## API contract

The backend exposes the following contract on port 3000:

| Method | Path | Response |
| --- | --- | --- |
| POST | `/api/links` | `201` link object, or `400` for invalid JSON/URL |
| GET | `/api/links` | `200` array of link objects |
| GET | `/:code` | `302` redirect and incremented hit count, or `404` |

## Clone and run

```bash
git clone --recurse-submodules https://github.com/Daniel-Lim88/shorten_.git
cd shorten_
cd backend && bun start
cd ../frontend && npm install && npx ng serve
cd ../cli && node cli.js ls
```

Open the frontend at `http://localhost:4200`. The generated release runs the
whole app on one port:

```bash
cd bundle && bun start
```

## Workflow

1. Edit each submodule on its own branch
2. Push the submodule changes upstream
3. Update the main pointer with `git submodule update --remote <path>`
4. Release the bundle with `node scripts/build-bundle.mjs --push`

The bundle branch is generated output; do not edit it by hand. GitHub Actions
rebuilds it hourly and builds the container image when its pointer changes.
