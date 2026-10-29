import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

import fs from 'node:fs';
import path from 'node:path';

function liveSyncPlugin(): Plugin {
  const rootDir = typeof import.meta.dirname !== 'undefined' ? import.meta.dirname : process.cwd();
  const STORAGE_FILE = path.resolve(rootDir, '.server_matches.json');

  interface UserSyncStore {
    matches: any[] | null;
    activeMatchId: string | null;
    footballMatch?: any | null;
    timestamp: number;
  }

  interface ServerStorageData {
    users: Record<string, UserSyncStore>;
  }

  function readCachedData(): ServerStorageData {
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.users && typeof parsed.users === 'object') {
          return parsed as ServerStorageData;
        }
        if (parsed && Array.isArray(parsed.matches)) {
          return {
            users: {
              default: {
                matches: parsed.matches,
                activeMatchId: parsed.activeMatchId || parsed.matches[0]?.id || null,
                timestamp: Date.now(),
              },
            },
          };
        }
      }
    } catch (e) {
      console.error('Error reading .server_matches.json', e);
    }
    return { users: {} };
  }

  function writeCachedData(data: ServerStorageData) {
    try {
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing .server_matches.json', e);
    }
  }

  let cachedData: ServerStorageData = readCachedData();
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

    const rawUrl = req.url || '';
    const pathname = rawUrl.split('?')[0];

    // 1. SSE Real-time stream for OBS Studio (CEF) and external devices
    if (pathname === '/api/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
        'Access-Control-Allow-Origin': '*',
      });
      res.write(': connected\n\n');
      sseClients.add(res);

      req.on('close', () => {
        sseClients.delete(res);
      });
      return;
    }

    // 2. POST update from Controller / Browser
    if (pathname === '/api/match' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const targetUser = data.userId || 'default';
          if (!cachedData.users) cachedData.users = {};

          if (data.footballMatch) {
            if (!cachedData.users[targetUser]) {
              cachedData.users[targetUser] = {
                matches: [],
                activeMatchId: null,
                footballMatch: data.footballMatch,
                timestamp: Date.now(),
              };
            } else {
              cachedData.users[targetUser].footballMatch = data.footballMatch;
              cachedData.users[targetUser].timestamp = Date.now();
            }
            writeCachedData(cachedData);

            const payload = `data: ${JSON.stringify({
              type: 'FOOTBALL_SYNC',
              userId: targetUser,
              footballMatch: data.footballMatch,
              timestamp: Date.now(),
            })}\n\n`;
            for (const client of sseClients) {
              try {
                client.write(payload);
              } catch {
                sseClients.delete(client);
              }
            }
          }

          if (
            data.matches &&
            Array.isArray(data.matches) &&
            data.matches.some((m: any) => m && m.team1 && m.innings)
          ) {
            const activeId = data.activeMatchId || data.matches[0]?.id;
            if (!cachedData.users[targetUser]) {
              cachedData.users[targetUser] = {
                matches: data.matches,
                activeMatchId: activeId,
                timestamp: Date.now(),
              };
            } else {
              cachedData.users[targetUser].matches = data.matches;
              cachedData.users[targetUser].activeMatchId = activeId;
              cachedData.users[targetUser].timestamp = Date.now();
            }
            writeCachedData(cachedData);

            const payload = `data: ${JSON.stringify({
              type: 'MATCHES_SYNC',
              userId: targetUser,
              matches: data.matches,
              activeMatchId: activeId,
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
            if (cachedData.users[targetUser]) {
              cachedData.users[targetUser].activeMatchId = data.activeMatchId;
              cachedData.users[targetUser].timestamp = Date.now();
              writeCachedData(cachedData);

              const payload = `data: ${JSON.stringify({
                type: 'MATCHES_SYNC',
                userId: targetUser,
                matches: cachedData.users[targetUser].matches,
                activeMatchId: data.activeMatchId,
                timestamp: Date.now(),
              })}\n\n`;
              for (const client of sseClients) {
                try {
                  client.write(payload);
                } catch {
                  sseClients.delete(client);
                }
              }
            }
          } else if (data.reset) {
            delete cachedData.users[targetUser];
            writeCachedData(cachedData);
          }

          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(
            JSON.stringify({
              success: true,
              activeMatchId: cachedData.users[targetUser]?.activeMatchId,
              footballMatch: cachedData.users[targetUser]?.footballMatch,
            })
          );
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
    if (pathname === '/api/match' && req.method === 'GET') {
      const freshData = readCachedData();
      cachedData = freshData;

      const parsedUrl = new URL(rawUrl, 'http://localhost');
      const qMatchId = parsedUrl.searchParams.get('matchId');
      const qUserId = parsedUrl.searchParams.get('userId');

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
      });

      // 1. If matchId is requested (e.g. from OBS transparent overlay)
      if (qMatchId) {
        for (const uId of Object.keys(cachedData.users)) {
          const userStore = cachedData.users[uId];
          const found = userStore?.matches?.find((m: any) => m?.id === qMatchId);
          if (found) {
            res.end(
              JSON.stringify({
                matches: [found],
                activeMatchId: qMatchId,
                footballMatch: userStore.footballMatch || null,
                timestamp: userStore.timestamp || Date.now(),
              })
            );
            return;
          }
        }
      }

      // 2. If userId is requested (from Controller or Dashboard)
      if (qUserId && cachedData.users[qUserId]) {
        const uStore = cachedData.users[qUserId];
        res.end(
          JSON.stringify({
            matches: uStore.matches,
            activeMatchId: uStore.activeMatchId,
            footballMatch: uStore.footballMatch || null,
            timestamp: uStore.timestamp || Date.now(),
          })
        );
        return;
      }

      // 3. Fallback: default user or first user
      const defaultUser = cachedData.users['default'] || Object.values(cachedData.users)[0];
      res.end(
        JSON.stringify({
          matches: defaultUser?.matches || null,
          activeMatchId: defaultUser?.activeMatchId || null,
          footballMatch: defaultUser?.footballMatch || null,
          timestamp: defaultUser?.timestamp || Date.now(),
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
