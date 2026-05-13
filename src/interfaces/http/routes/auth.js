import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { RegisterUser } from '../../../application/use-cases/auth/RegisterUser.js';
import { LoginUser } from '../../../application/use-cases/auth/LoginUser.js';
import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository.js';

const auth = new Hono();
const userRepository = new PrismaUserRepository();
const registerUser = new RegisterUser(userRepository);
const loginUser = new LoginUser(userRepository);

// Schema de Validação (L4 Requirements)
const signupSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(12)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// [POST] /auth/signup
auth.post('/signup', zValidator('json', signupSchema), async (c) => {
  const data = c.req.valid('json');
  
  try {
    const result = await registerUser.execute(data);
    return c.json(result, result.user ? 201 : 200);
  } catch (error) {
    return c.json({ error: 'Falha no processamento do registro' }, 500);
  }
});

// [POST] /auth/login
auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const data = c.req.valid('json');
  
  try {
    const result = await loginUser.execute(data);
    return c.json(result);
  } catch (error) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return c.json({ error: 'E-mail ou senha incorretos' }, 401);
    }
    return c.json({ error: 'Erro interno no servidor' }, 500);
  }
});

export default auth;
