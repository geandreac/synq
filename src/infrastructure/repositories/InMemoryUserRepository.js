/**
 * Repositório em memória para desenvolvimento inicial.
 * Substituir por PostgreSQL (Neon/Prisma) no futuro.
 */
export class InMemoryUserRepository {
    constructor() {
        this.users = [];
    }

    async findByEmail(email) {
        return this.users.find(u => u.email === email) || null;
    }

    async save(user) {
        user.id = Math.random().toString(36).substr(2, 9);
        this.users.push(user);
        console.log(`[DB MOCK] User saved: ${user.email} (Hash: ${user.passwordHash.substring(0, 15)}...)`);
        return user;
    }
}

export const userRepository = new InMemoryUserRepository();
