import 'dotenv/config';

/**
 * Configuração do Prisma 7 com carregamento explícito de ambiente.
 */
export default {
  datasource: {
    url: process.env.DATABASE_URL
  }
};
