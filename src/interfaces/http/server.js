import 'dotenv/config';
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

// Global Error Handler (Captura erros do banco ou lógica)
app.onError((err, c) => {
  console.error(`\n[SERVER ERROR]`, err);
  return c.json({ 
    error: 'Falha no processamento do registro', 
    details: err.message 
  }, 500);
});

// Rotas da API
app.route('/auth', auth);
app.route('/workspaces', workspaces);
app.route('/boards', boards);
app.route('/lists', lists);
app.route('/cards', cards);
app.get('/health', (c) => c.json({ status: 'healthy' }));

// Serve estáticos (JS, CSS, etc.) - Fora de /api
app.use('/assets/*', serveStatic({ root: './web/dist' }));
app.use('/favicon.ico', serveStatic({ path: './web/dist/favicon.ico' }));
app.use('/manifest.webmanifest', serveStatic({ path: './web/dist/manifest.webmanifest' }));
app.use('/sw.js', serveStatic({ path: './web/dist/sw.js' }));

// Fallback para SPA (Single Page Application) - Apenas para GET
app.get('*', (c, next) => {
  const path = c.req.path;
  // Se for uma rota de API conhecida ou tiver extensão, pula o fallback
  if (path.startsWith('/auth') || 
      path.startsWith('/workspaces') || 
      path.startsWith('/boards') || 
      path.startsWith('/lists') || 
      path.startsWith('/cards') ||
      path.includes('.')) {
    return next();
  }
  return serveStatic({ path: './web/dist/index.html' })(c, next);
});

const port = process.env.PORT || 3000;
console.log(`\n[SYNQ] SISTEMA DE LOGS ATIVADO - PORTA: ${port}`);
console.log(`[SYNQ] Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port: Number(port)
});

// 404 Handler Final (Garante JSON se nada acima coincidir)
app.notFound((c) => {
  return c.json({ error: 'Rota não encontrada' }, 404);
});
