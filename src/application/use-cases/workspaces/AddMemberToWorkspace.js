import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository.js';

/**
 * Caso de Uso: Adicionar Membro ao Workspace
 * Implementa a lógica de convite e controle de acesso (RBAC).
 */
export class AddMemberToWorkspace {
    constructor(workspaceRepository, userRepository) {
        this.workspaceRepository = workspaceRepository;
        this.userRepository = userRepository || new PrismaUserRepository();
    }

    async execute({ workspaceId, requesterId, targetEmail, role = 'MEMBER' }) {
        // 1. Verificar se o solicitante é ADMIN do workspace
        const requesterMembership = await this.workspaceRepository.getMember(workspaceId, requesterId);
        if (!requesterMembership || requesterMembership.role !== 'ADMIN') {
            throw new Error('UNAUTHORIZED: Apenas administradores podem convidar membros.');
        }

        // 2. Buscar o usuário pelo e-mail
        const targetUser = await this.userRepository.findByEmail(targetEmail);
        if (!targetUser) {
            throw new Error('USER_NOT_FOUND: Usuário não cadastrado no SYNQ.');
        }

        // 3. Verificar se já é membro
        const existingMembership = await this.workspaceRepository.getMember(workspaceId, targetUser.id);
        if (existingMembership) {
            throw new Error('ALREADY_MEMBER: Este usuário já faz parte do workspace.');
        }

        // 4. Adicionar ao workspace
        await this.workspaceRepository.addMember(workspaceId, targetUser.id, role);

        return {
            success: true,
            member: {
                id: targetUser.id,
                email: targetUser.email,
                name: targetUser.name,
                role
            }
        };
    }
}
