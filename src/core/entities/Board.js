/**
 * Entidade de Domínio: Board (Quadro)
 * Representa um quadro visual dentro de um workspace.
 */
export class Board {
    constructor({ id, name, workspaceId, createdAt }) {
        this.id = id;
        this.name = name;
        this.workspaceId = workspaceId;
        this.createdAt = createdAt;
    }

    static create({ name, workspaceId }) {
        if (!name || name.trim().length < 2) {
            throw new Error('Nome do quadro deve ter pelo menos 2 caracteres.');
        }
        return new Board({ name, workspaceId });
    }
}
