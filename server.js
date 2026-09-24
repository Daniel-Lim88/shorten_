const PORT = Number(process.env.PORT || 3000);
const DEFAULT_BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const PUBLIC_DIR = process.env.PUBLIC_DIR || null;
const links = new Map();

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function makeCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

function toIso(value = new Date()) {
  return new Date(value).toISOString();
}

function getBaseUrl(req) {
  const envBaseUrl = process.env.BASE_URL;
  if (envBaseUrl) return envBaseUrl.replace(/\/$/, '');
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`.replace(/\/$/, '');
  }
  const origin = req.headers.get('origin');
  if (origin) return origin.replace(/\/$/, '');
  return DEFAULT_BASE_URL.replace(/\/$/, '');
}

function isValidHttpUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function sendJson(payload, init = {}) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'Content-Type',
      ...(init.headers || {}),
    },
  });
}

async function serveStaticFile(pathname) {
  if (!PUBLIC_DIR) return null;
  const normalized = pathname === '/' ? '/index.html' : pathname;
  const filePath = normalized.split('/').filter(Boolean).join('/');
  const file = Bun.file(`${PUBLIC_DIR}/${filePath}`);
  if (await file.exists()) {
    const mime = filePath.endsWith('.html') ? 'text/html; charset=utf-8' : undefined;
    const headers = mime ? { 'content-type': mime } : {};
    return new Response(file, { headers });
  }
  return null;
}

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, POST, OPTIONS',
          'access-control-allow-headers': 'Content-Type',
        },
      });
    }

    const corsHeaders = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': 'Content-Type',
    };

    if (pathname === '/api/links') {
      if (req.method === 'GET') {
        return sendJson(Array.from(links.values()), { headers: corsHeaders });
      }

      if (req.method === 'POST') {
        return (async () => {
          let body;
          try {
            body = await req.json();
          } catch {
            return sendJson({ error: 'Invalid JSON body' }, { status: 400, headers: corsHeaders });
          }

          const urlValue = body && body.url;
          if (!isValidHttpUrl(urlValue)) {
            return sendJson({ error: 'Invalid or non-http(s) URL' }, { status: 400, headers: corsHeaders });
          }

          let code = makeCode();
          while (links.has(code)) {
            code = makeCode();
          }

          const shortUrl = `${getBaseUrl(req)}/${code}`;
          const createdAt = toIso();
          const link = { code, url: urlValue, shortUrl, hits: 0, createdAt };
          links.set(code, link);

          return sendJson(link, { status: 201, headers: corsHeaders });
        })();
      }
    }

    if (pathname === '/' && PUBLIC_DIR) {
      const fileResponse = serveStaticFile(pathname);
      if (fileResponse) return fileResponse;
    }

    if (pathname === '/' && !PUBLIC_DIR) {
      return sendJson({ error: 'Not found' }, { status: 404, headers: corsHeaders });
    }

    const code = pathname.replace(/^\//, '').split('/')[0];
    if (code && links.has(code)) {
      const link = links.get(code);
      link.hits += 1;
      return Response.redirect(link.url, 302);
    }

    if (PUBLIC_DIR) {
      const fileResponse = serveStaticFile(pathname);
      if (fileResponse) return fileResponse;
    }

    return sendJson({ error: 'Not found' }, { status: 404, headers: corsHeaders });
  },
});

console.log(`Snip backend running on http://localhost:${PORT}`);
