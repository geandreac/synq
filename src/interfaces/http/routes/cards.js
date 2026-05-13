import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { prisma } from '../../../infrastructure/database/prisma.js';

const cards = new Hono();

cards.use('/*', authMiddleware());

const createCardSchema = z.object({
  title: z.string().min(1),
  listId: z.string().uuid(),
  order: z.number().int(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional()
});

// [POST] /cards
cards.post('/', zValidator('json', createCardSchema), async (c) => {
  const { title, listId, order, description, dueDate } = c.req.valid('json');

  try {
    const card = await prisma.card.create({
      data: { 
        title, 
        listId, 
        order,
        description,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    return c.json({ success: true, card }, 201);
  } catch (error) {
    return c.json({ error: 'Falha ao criar cartão' }, 500);
  }
});

// [PATCH] /cards/:id
cards.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  try {
    const data = { ...body };
    if (data.dueDate) data.dueDate = new Date(data.dueDate);

    const card = await prisma.card.update({
      where: { id },
      data
    });
    return c.json({ success: true, card });
  } catch (error) {
    return c.json({ error: 'Falha ao atualizar cartão' }, 500);
  }
});

export default cards;
