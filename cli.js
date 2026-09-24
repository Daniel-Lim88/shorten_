#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const API_BASE = process.env.SNIP_API || 'http://localhost:3000';

function usage() {
  return `Usage:\n  snip add <url>\n  snip ls\n  snip open <code>\n  snip help\n`;
}

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}

async function requestJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function cmdAdd(url) {
  if (!/^https?:\/\//i.test(url)) {
    exitWithError('Invalid URL. Use http:// or https://');
  }

  const res = await requestJson(`${API_BASE}/api/links`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res || res.error) {
    exitWithError(res?.error || 'Unable to create short link');
  }

  console.log(res.shortUrl || res.url);
}

async function cmdLs() {
  const res = await requestJson(`${API_BASE}/api/links`);
  if (!Array.isArray(res)) {
    exitWithError('Unable to fetch links');
  }

  if (res.length === 0) {
    console.log('No links yet.');
    return;
  }

  const rows = res.map((item) => ({
    code: item.code,
    hits: String(item.hits),
    url: item.url,
  }));

  const codeWidth = Math.max(...rows.map((r) => r.code.length), 'CODE'.length);
  const hitsWidth = Math.max(...rows.map((r) => r.hits.length), 'HITS'.length);

  console.log(`${'CODE'.padEnd(codeWidth)}  ${'HITS'.padEnd(hitsWidth)}  URL`);
  console.log(`${'-'.repeat(codeWidth)}  ${'-'.repeat(hitsWidth)}  ${'-'.repeat(40)}`);

  for (const row of rows) {
    console.log(`${row.code.padEnd(codeWidth)}  ${row.hits.padEnd(hitsWidth)}  ${row.url}`);
  }
}

async function cmdOpen(code) {
  if (!code) exitWithError('Missing code');
  const res = await fetch(`${API_BASE}/${code}`, { redirect: 'manual' });
  const location = res.headers.get('location');
  if (!location) {
    exitWithError(`Code not found: ${code}`);
  }

  console.log(`Open: ${location}`);
  const platform = process.platform;
  const cmd = platform === 'darwin' ? 'open' : platform === 'win32' ? 'cmd.exe' : 'xdg-open';
  const args = platform === 'win32' ? ['/c', 'start', '', location] : [location];
  const result = spawnSync(cmd, args, { stdio: 'inherit' });
  if (result.error) {
    exitWithError(result.error.message);
  }
  process.exit(result.status ?? 0);
}

async function main() {
  const [, , command, ...args] = process.argv;

  try {
    if (!command || command === 'help' || command === '--help' || command === '-h') {
      console.log(usage());
      return;
    }

    if (command === 'add') {
      await cmdAdd(args[0]);
      return;
    }

    if (command === 'ls') {
      await cmdLs();
      return;
    }

    if (command === 'open') {
      await cmdOpen(args[0]);
      return;
    }

    console.error(usage());
    process.exit(1);
  } catch (error) {
    exitWithError(error?.message || 'Unexpected error');
  }
}

main();
