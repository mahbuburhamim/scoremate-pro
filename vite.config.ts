import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

import fs from 'node:fs';
import path from 'node:path';

function liveSyncPlugin(): Plugin {
  const rootDir = typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : process.cwd();
  const STORAGE_FILE = path.resolve(rootDir, '.server_matches.json');

  function readCachedData(): { matches: any[] | null; activeMatchId: string | null } {
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.matches) && parsed.matches.length > 0) {
          return {
            matches: parsed.matches,
            activeMatchId: parsed.activeMatchId || parsed.matches[0]?.id || null,
          };
        }
      }
    } catch (e) {
      console.error('Error reading .server_matches.json', e);
    }
    return { matches: null, activeMatchId: null };
  }

  function writeCachedData(data: { matches: any[] | null; activeMatchId: string | null }) {
    try {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing .server_matches.json', e);
    }
  }

  let cachedData = readCachedData();
  const sseClients = new Set<ServerResponse>();

  // Periodic SSE ping to keep OBS Studio CEF connections alive
  setInterval(() => {
    for (const client of sseClients) {
      try {
        client.write(':ping\n\n');
      } catch {
        sseClients.delete(client);
      }
    }
  }, 10000);

  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    // 0. Handle CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      });
      res.end();
      return;
    }

    const url = req.url?.split('?')[0];

    // 1. SSE Real-time stream for OBS Studio (CEF) and external devices
    if (url === '/api/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*',
      });
      res.write(': connected\n\n');
      sseClients.add(res);

      const freshData = readCachedData();
      if (freshData.matches) {
        cachedData = freshData;
        res.write(
          `data: ${JSON.stringify({
            type: 'MATCHES_SYNC',
            matches: cachedData.matches,
            activeMatchId: cachedData.activeMatchId,
            timestamp: Date.now(),
          })}\n\n`
        );
      }

      req.on('close', () => {
        sseClients.delete(res);
      });
      return;
    }

    // 2. POST update from Controller / Browser
    if (url === '/api/match' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          if (
            data.matches &&
            Array.isArray(data.matches) &&
            data.matches.some((m: any) => m && m.team1 && m.innings)
          ) {
            const activeId = data.activeMatchId || cachedData.activeMatchId || data.matches[0]?.id;
            cachedData = {
              matches: data.matches,
              activeMatchId: activeId,
            };
            writeCachedData(cachedData);

            const payload = `data: ${JSON.stringify({
              type: 'MATCHES_SYNC',
              matches: cachedData.matches,
              activeMatchId: cachedData.activeMatchId,
              timestamp: Date.now(),
            })}\n\n`;
            for (const client of sseClients) {
              try {
                client.write(payload);
              } catch {
                sseClients.delete(client);
              }
            }
          } else if (data.activeMatchId) {
            cachedData.activeMatchId = data.activeMatchId;
            writeCachedData(cachedData);
            const payload = `data: ${JSON.stringify({
              type: 'MATCHES_SYNC',
              matches: cachedData.matches,
              activeMatchId: cachedData.activeMatchId,
              timestamp: Date.now(),
            })}\n\n`;
            for (const client of sseClients) {
              try {
                client.write(payload);
              } catch {
                sseClients.delete(client);
              }
            }
          } else if (data.reset) {
            cachedData = { matches: null, activeMatchId: null };
            try {
              if (fs.existsSync(STORAGE_FILE)) fs.unlinkSync(STORAGE_FILE);
            } catch {}
          }
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ success: true, activeMatchId: cachedData.activeMatchId }));
        } catch {
          res.writeHead(400, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
      return;
    }

    // 3. GET current match state (guaranteed fresh with strict no-cache headers for OBS CEF)
    if (url === '/api/match' && req.method === 'GET') {
      const freshData = readCachedData();
      if (freshData.matches) {
        cachedData = freshData;
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(
        JSON.stringify({
          matches: cachedData.matches,
          activeMatchId: cachedData.activeMatchId,
          timestamp: Date.now(),
        })
      );
      return;
    }

    next();
  };

  return {
    name: 'live-sync-plugin',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), liveSyncPlugin()],
})
