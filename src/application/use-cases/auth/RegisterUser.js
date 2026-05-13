import { PasswordService } from '../../../infrastructure/security/PasswordService.js';
import { User } from '../../../core/entities/User.js';

/**
 * Caso de Uso: Registro de Usuário
 * Orquestra a lógica de criação de conta e proteção de dados.
 */
export class RegisterUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ email, name, password }) {
        // 1. Verificar se usuário já existe
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            // Retornamos sucesso genérico por segurança (evitar enumeração de e-mails)
            // Mas internamente lançamos um erro ou logamos
            return { success: true, message: 'Se o e-mail for válido, você receberá um link.' };
        }

        // 2. Gerar Hash Seguro (Argon2id)
        const passwordHash = await PasswordService.hash(password);

        // 3. Criar Entidade de Domínio
        const user = User.create({
            email,
            name,
            passwordHash
        });

        // 4. Persistir
        await this.userRepository.save(user);

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    }
}
