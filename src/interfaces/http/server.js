import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import auth from './routes/auth.js';
import workspaces from './routes/workspaces.js';
import boards from './routes/boards.js';
import lists from './routes/lists.js';
import cards from './routes/cards.js';

import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

// Global Middlewares
app.use('*', logger());
app.use('*', cors());

// Global Error Handler (Garante resposta JSON em erros)
app.onError((err, c) => {
  console.error(`[SERVER ERROR]`, err);
  return c.json({ error: 'Erro interno no servidor', message: err.message }, 500);
});

// Rotas da API (Prefixadas com /api para evitar conflito com estáticos)
app.route('/api/auth', auth);
app.route('/api/workspaces', workspaces);
app.route('/api/boards', boards);
app.route('/api/lists', lists);
app.route('/api/cards', cards);
app.get('/api/health', (c) => c.json({ status: 'healthy' }));

// Serve estáticos (JS, CSS, etc.) - Fora de /api
app.use('/assets/*', serveStatic({ root: './web/dist' }));
app.use('/favicon.ico', serveStatic({ path: './web/dist/favicon.ico' }));
app.use('/manifest.webmanifest', serveStatic({ path: './web/dist/manifest.webmanifest' }));
app.use('/sw.js', serveStatic({ path: './web/dist/sw.js' }));

// Fallback para SPA (Single Page Application) - Apenas para GET e fora de /api
app.get('*', (c, next) => {
  if (c.req.path.startsWith('/api') || c.req.path.includes('.')) {
    return next();
  }
  return serveStatic({ path: './web/dist/index.html' })(c, next);
});

const port = process.env.PORT || 3000;
console.log(`[SYNQ] Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port: Number(port)
});
