import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { prisma } from '../../../infrastructure/database/prisma.js';

const lists = new Hono();

lists.use('/*', authMiddleware());

const createListSchema = z.object({
  name: z.string().min(1),
  boardId: z.string().uuid(),
  order: z.number().int()
});

// [POST] /lists
lists.post('/', zValidator('json', createListSchema), async (c) => {
  const { name, boardId, order } = c.req.valid('json');

  try {
    const list = await prisma.list.create({
      data: { name, boardId, order }
    });
    return c.json({ success: true, list }, 201);
  } catch (error) {
    return c.json({ error: 'Falha ao criar coluna' }, 500);
  }
});

export default lists;
