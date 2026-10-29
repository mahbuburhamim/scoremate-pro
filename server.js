import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT) || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const STORAGE_FILE = path.join(__dirname, '.server_matches.json');
let sseClients = [];

function readData() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      return JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
    }
  } catch {}
  return { users: {} };
}

function writeData(data) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {}
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // SSE endpoint for OBS and controller live sync
  if (pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write(':\n\n');
    sseClients.push(res);
    req.on('close', () => {
      sseClients = sseClients.filter((c) => c !== res);
    });
    return;
  }

  // API match endpoint
  if (pathname === '/api/match') {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          const cached = readData();
          if (!cached.users) cached.users = {};
          const uid = payload.userId || 'default';
          
          if (!cached.users[uid]) {
            cached.users[uid] = {
              matches: payload.matches || [],
              activeMatchId: payload.activeMatchId || null,
              footballMatch: payload.footballMatch || null,
              timestamp: payload.timestamp || Date.now(),
            };
          } else {
            if (payload.matches) cached.users[uid].matches = payload.matches;
            if (payload.activeMatchId !== undefined) cached.users[uid].activeMatchId = payload.activeMatchId;
            if (payload.footballMatch) cached.users[uid].footballMatch = payload.footballMatch;
            cached.users[uid].timestamp = payload.timestamp || Date.now();
          }
          writeData(cached);

          const sseData = JSON.stringify({
            type: payload.footballMatch ? 'FOOTBALL_SYNC' : 'MATCHES_SYNC',
            userId: uid,
            matches: cached.users[uid].matches,
            activeMatchId: cached.users[uid].activeMatchId,
            footballMatch: cached.users[uid].footballMatch,
            timestamp: Date.now(),
          });
          sseClients.forEach((client) => {
            try {
              client.write(`data: ${sseData}\n\n`);
            } catch {}
          });
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, footballMatch: cached.users[uid].footballMatch }));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'invalid json' }));
        }
      });
      return;
    }

    if (req.method === 'GET') {
      const matchId = parsedUrl.searchParams.get('matchId');
      const userId = parsedUrl.searchParams.get('userId') || 'default';
      const cached = readData();
      if (!cached.users) cached.users = {};

      if (matchId) {
        for (const uid in cached.users) {
          const found = cached.users[uid]?.matches?.find((m) => m.id === matchId);
          if (found) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              matches: [found],
              activeMatchId: matchId,
              footballMatch: cached.users[uid].footballMatch || null,
              timestamp: cached.users[uid].timestamp
            }));
            return;
          }
        }
      }

      const userData = cached.users[userId] || Object.values(cached.users)[0] || { matches: [], activeMatchId: null, footballMatch: null, timestamp: 0 };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        matches: userData.matches,
        activeMatchId: userData.activeMatchId,
        footballMatch: userData.footballMatch || null,
        timestamp: userData.timestamp,
        userId
      }));
      return;
    }
  }

  // Static File Serving
  const safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(DIST_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA Fallback: serve index.html
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (indexErr, content) => {
        if (indexErr) {
          res.writeHead(404);
          res.end('Not Found');
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache',
          });
          res.end(content);
        }
      });
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
