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

// Rotas da API (Prefixadas com /api para evitar conflito com estáticos)
const apiRoutes = new Hono();
apiRoutes.route('/auth', auth);
apiRoutes.route('/workspaces', workspaces);
apiRoutes.route('/boards', boards);
apiRoutes.route('/lists', lists);
apiRoutes.route('/cards', cards);
apiRoutes.get('/health', (c) => c.json({ status: 'healthy' }));

app.route('/api', apiRoutes);

// Serve Frontend Static Files in Production
app.use('*', serveStatic({ root: './web/dist' }));

// Fallback para SPA (Single Page Application)
app.get('*', serveStatic({ path: './web/dist/index.html' }));

const port = process.env.PORT || 3000;
console.log(`[SYNQ] Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port: Number(port)
});
