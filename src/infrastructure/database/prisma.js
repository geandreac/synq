import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

let prisma;

console.log(`[PRISMA DEBUG] DATABASE_URL carregada:`, !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL.trim().replace(/^["']|["']$/g, '').replace(/[\r\n]/g, '');
  console.log(`[PRISMA DEBUG] URL final: [${url.substring(0, 20)}...${url.substring(url.length - 10)}]`);
  console.log(`[PRISMA DEBUG] Comprimento final:`, url.length);
  
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
