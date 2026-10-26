import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

function liveSyncPlugin(): Plugin {
  let cachedMatches: any = null;
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

          if (cachedMatches) {
            res.write(`data: ${JSON.stringify({ type: 'MATCHES_SYNC', matches: cachedMatches })}\n\n`);
          }

          req.on('close', () => {
            sseClients.delete(res);
          });
          return;
        }

        // 2. POST update from Controller
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
                cachedMatches = data.matches;
                const payload = `data: ${JSON.stringify({ type: 'MATCHES_SYNC', matches: cachedMatches })}\n\n`;
                for (const client of sseClients) {
                  try {
                    client.write(payload);
                  } catch {
                    sseClients.delete(client);
                  }
                }
              } else if (data.reset) {
                cachedMatches = null;
              }
              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(JSON.stringify({ success: true }));
            } catch {
              res.writeHead(400);
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        // 3. GET current match state
        if (url === '/api/match' && req.method === 'GET') {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(JSON.stringify({ matches: cachedMatches }));
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
