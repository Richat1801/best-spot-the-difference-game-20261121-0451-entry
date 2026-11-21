// serve.ts — a minimal static file server for local play-testing.
// Usage: node serve.ts [--port 8090]   then open http://localhost:8090
// Serves only the game/ folder next to this file; standard library only.
import { readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const gameDir = fileURLToPath(new URL('./game', import.meta.url));
const portFlag = process.argv.indexOf('--port');
const port = portFlag >= 0 ? Number(process.argv[portFlag + 1]) || 8080 : 8080;

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

createServer((req, res) => {
  const rawPath = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  const rel = normalize(rawPath === '/' ? '/index.html' : rawPath).replace(/^[/\\]+/, '');
  const filePath = join(gameDir, rel);
  if (!filePath.startsWith(gameDir)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  try {
    if (!statSync(filePath).isFile()) throw new Error('not a file');
    const body = readFileSync(filePath);
    res.writeHead(200, { 'content-type': TYPES[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Twin Vista at http://localhost:${port}`));
