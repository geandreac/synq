import { prisma } from '../database/prisma.js';
import { User } from '../../core/entities/User.js';

/**
 * Implementação do repositório de usuários utilizando Prisma.
 */
export class PrismaUserRepository {
    /**
     * Busca um usuário pelo e-mail.
     * @param {string} email 
     * @returns {Promise<User|null>}
     */
    async findByEmail(email) {
        const userData = await prisma.user.findUnique({
            where: { email }
        });

        if (!userData) return null;

        return new User({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            passwordHash: userData.passwordHash,
            createdAt: userData.createdAt
        });
    }

    /**
     * Salva ou atualiza um usuário no banco.
     * @param {User} user 
     * @returns {Promise<User>}
     */
    async save(user) {
        const userData = await prisma.user.upsert({
            where: { email: user.email },
            update: {
                name: user.name,
                passwordHash: user.passwordHash
            },
            create: {
                email: user.email,
                name: user.name,
                passwordHash: user.passwordHash
            }
        });

        user.id = userData.id;
        user.createdAt = userData.createdAt;
        
        return user;
    }
}
