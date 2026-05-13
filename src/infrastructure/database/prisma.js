import { PrismaClient } from '@prisma/client';

/**
 * Instância Singleton do Prisma Client.
 * Gerencia a conexão com o banco de dados PostgreSQL.
 */
export const prisma = new PrismaClient({
    // Na versão 7, passamos o adapter ou URL aqui se necessário, 
    // ou ele pega do prisma.config.ts / .env se configurado corretamente.
});
