import argon2 from 'argon2';
import 'dotenv/config';

/**
 * Serviço de Proteção de Credenciais
 * Utiliza Argon2id conforme recomendação OWASP e classificação L4.
 */
export class PasswordService {
    static options = {
        type: argon2.argon2id,
        memoryCost: parseInt(process.env.ARGON2_MEMORY_COST) || 65536,
        timeCost: parseInt(process.env.ARGON2_ITERATIONS) || 3,
        parallelism: parseInt(process.env.ARGON2_PARALLELISM) || 4
    };

    /**
     * Gera um hash Argon2id para a senha fornecida.
     * @param {string} password - Senha em texto claro.
     * @returns {Promise<string>} Hash gerado.
     */
    static async hash(password) {
        try {
            return await argon2.hash(password, this.options);
        } catch (error) {
            console.error('[SECURITY] Error hashing password:', error);
            throw new Error('INTERNAL_SERVER_ERROR');
        }
    }

    /**
     * Compara uma senha com um hash existente.
     * @param {string} hash - Hash do banco.
     * @param {string} password - Senha fornecida pelo usuário.
     * @returns {Promise<boolean>}
     */
    static async compare(hash, password) {
        try {
            return await argon2.verify(hash, password);
        } catch (error) {
            return false;
        }
    }
}
