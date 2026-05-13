import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import ws from 'ws';

console.log(`[PRISMA DEBUG] DATABASE_URL carregada:`, !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL.trim();
  console.log(`[PRISMA DEBUG] Comprimento da URL:`, url.length);
  console.log(`[PRISMA DEBUG] Início da URL:`, url.substring(0, 15) + "...");
}

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL?.trim(), 
  webSocketConstructor: ws 
});
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });
