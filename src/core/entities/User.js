/**
 * Entidade de Usuário (Core Domain)
 * Representa as regras de negócio puras de um usuário no sistema.
 */
export class User {
    constructor({ id, email, name, passwordHash, createdAt }) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt || new Date();
    }

    // Validações de domínio podem ser adicionadas aqui
    static create(data) {
        if (!data.email.includes('@')) throw new Error('Invalid email');
        return new User(data);
    }
}
