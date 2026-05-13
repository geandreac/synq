import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

console.log(`[PRISMA DEBUG] URL presente:`, !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  console.log(`[PRISMA DEBUG] Início da URL:`, process.env.DATABASE_URL.substring(0, 15) + "...");
}

/**
 * Instância Singleton do Prisma Client com Adapter do Neon.
 * Configurado para conformidade com Prisma 7 e performance serverless.
 */
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString, webSocketConstructor: ws });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });
