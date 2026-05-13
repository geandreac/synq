import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

let prisma;

console.log(`[PRISMA DEBUG] DATABASE_URL carregada:`, !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL.trim().replace(/^["'](.+)["']$/, '$1');
  console.log(`[PRISMA DEBUG] Comprimento da URL (limpa):`, url.length);
  console.log(`[PRISMA DEBUG] Início da URL:`, url.substring(0, 15) + "...");
  
  const pool = new Pool({ 
    connectionString: url, 
    webSocketConstructor: ws 
  });
  const adapter = new PrismaNeon(pool);
  prisma = new PrismaClient({ adapter });
} else {
  console.error('[PRISMA ERROR] DATABASE_URL não encontrada!');
  prisma = new PrismaClient();
}

export { prisma };
