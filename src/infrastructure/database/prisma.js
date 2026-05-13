import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

/**
 * Instância do Prisma Client configurada para máxima estabilidade.
 * Removemos o adapter serverless para evitar conflitos no Windows/Localhost.
 * O Prisma gerencia a conexão nativamente usando a DATABASE_URL.
 */
const url = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, '');

console.log(`[PRISMA] Inicializando com URL: [${url?.substring(0, 20)}...]`);

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: url
    }
  }
});

// Teste de conexão opcional (apenas log)
prisma.$connect()
  .then(() => console.log('[PRISMA] Conexão estabelecida com sucesso.'))
  .catch((err) => console.error('[PRISMA] Erro ao conectar no banco:', err.message));
