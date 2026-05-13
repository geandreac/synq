/**
 * Caso de Uso: Criar Workspace
 * Orquestra a criação de um novo ambiente de colaboração.
 */
export class CreateWorkspace {
    constructor(workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    async execute({ name, ownerId }) {
        // Validação básica de negócio
        if (!name || name.trim().length < 3) {
            throw new Error('INVALID_NAME');
        }

        // Criar no repositório (garante transação de membro ADMIN)
        const workspace = await this.workspaceRepository.create(name, ownerId);

        return {
            success: true,
            workspace: {
                id: workspace.id,
                name: workspace.name
            }
        };
    }
}
