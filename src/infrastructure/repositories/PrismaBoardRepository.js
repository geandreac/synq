import { prisma } from '../database/prisma.js';
import { Board } from '../../core/entities/Board.js';

/**
 * Repositório de Boards utilizando Prisma.
 */
export class PrismaBoardRepository {
    async create(name, workspaceId) {
        const boardData = await prisma.board.create({
            data: {
                name,
                workspaceId
            }
        });

        return new Board({
            id: boardData.id,
            name: boardData.name,
            workspaceId: boardData.workspaceId,
            createdAt: boardData.createdAt
        });
    }

    async findByWorkspaceId(workspaceId) {
        const boards = await prisma.board.findMany({
            where: { workspaceId },
            include: {
                lists: {
                    include: {
                        cards: true
                    }
                }
            }
        });

        return boards; // Retornamos os dados brutos com relações para o Kanban
    }
}
