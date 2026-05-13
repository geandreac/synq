import { jwt } from 'hono/jwt';

/**
 * Middleware de Autenticação JWT.
 * Protege rotas exigindo um Bearer Token válido.
 * Implementa o princípio de Zero Trust: se o token for inválido ou ausente, a requisição é negada.
 */
export const authMiddleware = (secret) => {
    return jwt({
        secret: secret || process.env.JWT_SECRET || 'synq-super-secret-dev-key',
    });
};

/**
 * Middleware de Autorização Adicional (Opcional)
 * Pode ser usado para injetar o usuário completo no contexto.
 */
export const injectUser = async (c, next) => {
    const payload = c.get('jwtPayload');
    if (payload) {
        c.set('userId', payload.sub);
        c.set('userEmail', payload.email);
    }
    await next();
};
