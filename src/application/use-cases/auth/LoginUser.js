import { sign } from 'hono/jwt';
import { PasswordService } from '../../../infrastructure/security/PasswordService.js';

/**
 * Caso de Uso: Login de Usuário
 * Responsável por validar credenciais e emitir tokens de acesso (L4).
 */
export class LoginUser {
    constructor(userRepository, jwtSecret) {
        this.userRepository = userRepository;
        this.jwtSecret = jwtSecret || process.env.JWT_SECRET || 'synq-super-secret-dev-key';
    }

    async execute({ email, password }) {
        // 1. Buscar usuário por e-mail
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        // 2. Verificar senha (Argon2id)
        const isPasswordValid = await PasswordService.compare(user.passwordHash, password);
        if (!isPasswordValid) {
            throw new Error('INVALID_CREDENTIALS');
        }

        // 3. Gerar Access Token (Expiração curta: 15-30 min)
        const payload = {
            sub: user.id,
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + 60 * 30, // 30 min
            iat: Math.floor(Date.now() / 1000),
        };

        const accessToken = await sign(payload, this.jwtSecret);

        // 4. Gerar Refresh Token (Simulação para o MVP)
        const refreshToken = Math.random().toString(36).substring(2) + Date.now().toString(36);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    }
}
