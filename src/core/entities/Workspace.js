/**
 * Entidade de Domínio: Workspace
 * Representa um espaço de trabalho colaborativo.
 */
export class Workspace {
    constructor({ id, name, createdAt, updatedAt }) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static create({ name }) {
        if (!name || name.length < 3) {
            throw new Error('Nome do workspace deve ter pelo menos 3 caracteres.');
        }
        return new Workspace({ name });
    }
}
