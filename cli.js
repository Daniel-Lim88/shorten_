#!/usr/bin/env node

const { spawnSync } = require('child_process');

const API_BASE = process.env.SNIP_API || 'http://localhost:3000';

function usage() {
  return [
    'Usage:',
    '  snip add <url>',
    '  snip ls',
    '  snip open <code>',
    '  snip help',
    '',
    `Environment: SNIP_API (default ${API_BASE})`,
  ].join('\n');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function createLink(targetUrl) {
  if (!/^https?:\/\//i.test(targetUrl)) {
    fail('Invalid URL. Use http:// or https://');
  }

  const payload = await requestJson(`${API_BASE}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: targetUrl }),
  });

  if (!payload || payload.error) {
    fail(payload?.error || 'Unable to create short link');
  }

  console.log(payload.shortUrl || payload.url);
}

async function listLinks() {
  const payload = await requestJson(`${API_BASE}/api/links`);
  if (!Array.isArray(payload)) {
    fail('Unable to fetch links');
  }

  if (payload.length === 0) {
    console.log('No links yet.');
    return;
  }

  const rows = payload.map((item) => ({
    code: item.code,
    hits: String(item.hits),
    url: item.url,
  }));

  const codeWidth = Math.max(...rows.map((row) => row.code.length), 'CODE'.length);
  const hitsWidth = Math.max(...rows.map((row) => row.hits.length), 'HITS'.length);

  console.log(`${'CODE'.padEnd(codeWidth)}  ${'HITS'.padEnd(hitsWidth)}  URL`);
  console.log(`${'-'.repeat(codeWidth)}  ${'-'.repeat(hitsWidth)}  ${'-'.repeat(40)}`);

  for (const row of rows) {
    console.log(`${row.code.padEnd(codeWidth)}  ${row.hits.padEnd(hitsWidth)}  ${row.url}`);
  }
}

async function openLink(code) {
  if (!code) {
    fail('Missing code');
  }

  const response = await fetch(`${API_BASE}/${code}`, { redirect: 'manual' });
  const location = response.headers.get('location');

  if (!location) {
    fail(`Code not found: ${code}`);
  }

  console.log(`Open: ${location}`);

  const platform = process.platform;
  const command = platform === 'darwin' ? 'open' : platform === 'win32' ? 'cmd.exe' : 'xdg-open';
  const args = platform === 'win32' ? ['/c', 'start', '', location] : [location];

  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) {
    fail(result.error.message);
  }

  process.exit(result.status ?? 0);
}

async function main() {
  const [, , command, ...args] = process.argv;

  if (!command || command === 'help' || command === '--help' || command === '-h') {
    console.log(usage());
    return;
  }

  if (command === 'add') {
    await createLink(args[0]);
    return;
  }

  if (command === 'ls') {
    await listLinks();
    return;
  }

  if (command === 'open') {
    await openLink(args[0]);
    return;
  }

  console.error(usage());
  process.exit(1);
}

main().catch((error) => fail(error?.message || 'Unexpected error'));
