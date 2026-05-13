import { prisma } from '../database/prisma.js';
import { Workspace } from '../../core/entities/Workspace.js';

/**
 * Repositório de Workspaces utilizando Prisma.
 */
export class PrismaWorkspaceRepository {
    /**
     * Cria um novo workspace e define o usuário como ADMIN.
     * Operação atômica via transação Prisma.
     */
    async create(name, ownerId) {
        const workspaceData = await prisma.workspace.create({
            data: {
                name,
                members: {
                    create: {
                        userId: ownerId,
                        role: 'ADMIN'
                    }
                }
            }
        });

        return new Workspace({
            id: workspaceData.id,
            name: workspaceData.name,
            createdAt: workspaceData.createdAt,
            updatedAt: workspaceData.updatedAt
        });
    }

    /**
     * Lista todos os workspaces onde o usuário é membro.
     */
    async findByUserId(userId) {
        const memberships = await prisma.workspaceMember.findMany({
            where: { userId },
            include: {
                workspace: true
            }
        });

        return memberships.map(m => new Workspace({
            id: m.workspace.id,
            name: m.workspace.name,
            createdAt: m.workspace.createdAt,
            updatedAt: m.workspace.updatedAt
        }));
    }

    /**
     * Adiciona um membro a um workspace.
     */
    async addMember(workspaceId, userId, role = 'MEMBER') {
        return await prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId,
                role
            }
        });
    }

    /**
     * Busca o cargo de um usuário em um workspace específico.
     */
    async getMember(workspaceId, userId) {
        return await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId
                }
            }
        });
    }
}
