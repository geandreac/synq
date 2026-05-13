import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { PrismaBoardRepository } from '../../../infrastructure/repositories/PrismaBoardRepository.js';
import { PrismaWorkspaceRepository } from '../../../infrastructure/repositories/PrismaWorkspaceRepository.js';

const boards = new Hono();
const boardRepository = new PrismaBoardRepository();
const workspaceRepository = new PrismaWorkspaceRepository();

boards.use('/*', authMiddleware());

const createBoardSchema = z.object({
  name: z.string().min(2),
  workspaceId: z.string().uuid()
});

// [POST] /boards
boards.post('/', zValidator('json', createBoardSchema), async (c) => {
  const { name, workspaceId } = c.req.valid('json');
  const payload = c.get('jwtPayload');
  const userId = payload.sub;

  try {
    // Verificar se o usuário é membro do workspace
    const membership = await workspaceRepository.getMember(workspaceId, userId);
    if (!membership) {
        return c.json({ error: 'UNAUTHORIZED: Você não faz parte deste workspace.' }, 403);
    }

    const board = await boardRepository.create(name, workspaceId);
    return c.json({ success: true, board }, 201);
  } catch (error) {
    return c.json({ error: 'Falha ao criar quadro' }, 500);
  }
});

// [GET] /boards/workspace/:workspaceId
boards.get('/workspace/:workspaceId', async (c) => {
  const workspaceId = c.req.param('workspaceId');
  const payload = c.get('jwtPayload');
  const userId = payload.sub;

  try {
    const membership = await workspaceRepository.getMember(workspaceId, userId);
    if (!membership) {
        return c.json({ error: 'UNAUTHORIZED' }, 403);
    }

    const result = await boardRepository.findByWorkspaceId(workspaceId);
    return c.json({ success: true, boards: result });
  } catch (error) {
    return c.json({ error: 'Falha ao buscar quadros' }, 500);
  }
});

export default boards;
