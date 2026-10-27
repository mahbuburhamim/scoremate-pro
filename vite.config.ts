import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

import fs from 'node:fs';
import path from 'node:path';

function liveSyncPlugin(): Plugin {
  const STORAGE_FILE = path.resolve(__dirname, '.server_matches.json');

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

  return {
    name: 'live-sync-plugin',
    configureServer(server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
        const url = req.url?.split('?')[0];

        // 1. SSE Real-time stream for OBS Studio and external devices
        if (url === '/api/events') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });
          res.write(':\n\n'); // SSE comment to keep connection alive
          sseClients.add(res);

          if (!cachedData.matches) {
            cachedData = readCachedData();
          }

          if (cachedData.matches) {
            res.write(
              `data: ${JSON.stringify({
                type: 'MATCHES_SYNC',
                matches: cachedData.matches,
                activeMatchId: cachedData.activeMatchId,
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
                'Access-Control-Allow-Origin': '*',
              });
              res.end(JSON.stringify({ success: true, activeMatchId: cachedData.activeMatchId }));
            } catch {
              res.writeHead(400);
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        // 3. GET current match state
        if (url === '/api/match' && req.method === 'GET') {
          if (!cachedData.matches) {
            cachedData = readCachedData();
          }
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(
            JSON.stringify({
              matches: cachedData.matches,
              activeMatchId: cachedData.activeMatchId,
            })
          );
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), liveSyncPlugin()],
})
