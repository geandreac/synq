import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

/**
 * Configuração oficial do Prisma 7 para PostgreSQL.
 * Utilizamos o adaptador nativo do pg conforme exigido pela nova especificação.
 */
const url = process.env.DATABASE_URL?.trim().replace(/^["']|["']$/g, '');

const pool = new pg.Pool({ connectionString: url });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

prisma.$connect()
  .then(() => console.log('[PRISMA] Conexão estabelecida com sucesso (Adapter PG).'))
  .catch((err) => console.error('[PRISMA] Erro ao conectar no banco:', err.message));
