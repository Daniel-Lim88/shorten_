# snip-backend

A tiny URL shortener backend built with Bun.

## Start

```bash
bun start
```

## API

- `POST /api/links` create a short URL
- `GET /api/links` list all links
- `GET /:code` redirect to the original URL
