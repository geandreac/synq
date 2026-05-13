import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

/**
 * Instância Singleton do Prisma Client com Adapter do Neon.
 * Configurado para conformidade com Prisma 7 e performance serverless.
 */
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString, webSocketConstructor: ws });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });
