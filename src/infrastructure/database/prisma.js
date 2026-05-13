import { PrismaClient } from '@prisma/client';

/**
 * Instância Singleton do Prisma Client.
 * Gerencia a conexão com o banco de dados PostgreSQL.
 */
export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});
