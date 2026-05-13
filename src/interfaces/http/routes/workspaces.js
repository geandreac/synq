import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { CreateWorkspace } from '../../../application/use-cases/workspaces/CreateWorkspace.js';
import { AddMemberToWorkspace } from '../../../application/use-cases/workspaces/AddMemberToWorkspace.js';
import { PrismaWorkspaceRepository } from '../../../infrastructure/repositories/PrismaWorkspaceRepository.js';
import { prisma } from '../../../infrastructure/database/prisma.js';

const workspaces = new Hono();
const workspaceRepository = new PrismaWorkspaceRepository();
const createWorkspace = new CreateWorkspace(workspaceRepository);
const addMember = new AddMemberToWorkspace(workspaceRepository);

// Aplicar Middleware de Autenticação em todas as rotas de Workspace
workspaces.use('/*', authMiddleware());

const createSchema = z.object({
  name: z.string().min(3)
});

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['ADMIN', 'MEMBER', 'VIEWER']).default('MEMBER')
});

// [POST] /workspaces
workspaces.post('/', zValidator('json', createSchema), async (c) => {
  const { name } = c.req.valid('json');
  const payload = c.get('jwtPayload');
  const ownerId = payload.sub;

  try {
    const result = await createWorkspace.execute({ name, ownerId });
    return c.json(result, 201);
  } catch (error) {
    return c.json({ error: 'Falha ao criar workspace' }, 500);
  }
});

// [POST] /workspaces/:id/members
workspaces.post('/:id/members', zValidator('json', inviteSchema), async (c) => {
  const workspaceId = c.req.param('id');
  const { email, role } = c.req.valid('json');
  const payload = c.get('jwtPayload');
  const requesterId = payload.sub;

  try {
    const result = await addMember.execute({
      workspaceId,
      requesterId,
      targetEmail: email,
      role
    });
    return c.json(result, 201);
  } catch (error) {
    const status = error.message.includes('UNAUTHORIZED') ? 403 : 400;
    return c.json({ error: error.message }, status);
  }
});

// [GET] /workspaces/:id/members
workspaces.get('/:id/members', async (c) => {
  const workspaceId = c.req.param('id');
  const payload = c.get('jwtPayload');
  const userId = payload.sub;

  try {
    const membership = await workspaceRepository.getMember(workspaceId, userId);
    if (!membership) {
        return c.json({ error: 'UNAUTHORIZED: Você não faz parte deste workspace.' }, 403);
    }

    const members = await prisma.workspaceMember.findMany({
        where: { workspaceId },
        include: { user: true }
    });

    return c.json({
        success: true,
        members: members.map(m => ({
            id: m.user.id,
            name: m.user.name,
            email: m.user.email,
            role: m.role
        }))
    });
  } catch (error) {
    return c.json({ error: 'Falha ao listar membros' }, 500);
  }
});

// [GET] /workspaces
workspaces.get('/', async (c) => {
  const payload = c.get('jwtPayload');
  const userId = payload.sub;

  try {
    const result = await workspaceRepository.findByUserId(userId);
    return c.json({ success: true, workspaces: result });
  } catch (error) {
    return c.json({ error: 'Falha ao listar workspaces' }, 500);
  }
});

export default workspaces;
