# BDD-Fase-1: Sistema de Identidade e Acesso

[ATUANDO COMO: PRODUCT OWNER]

## Objetivo
Garantir que o processo de entrada e gestão de usuários no SYNQ seja seguro, intuitivo e siga as diretrizes de proteção de dados L3/L4.

---

## RF-001: Cadastro de Novo Usuário
**Como** um novo visitante,
**quero** criar uma conta no SYNQ,
**para** começar a organizar meus projetos.

### Cenário: Cadastro com Sucesso
- **Dado** que estou na página de registro.
- **Quando** preencho e-mail válido, nome e uma senha forte (mín. 12 caracteres).
- **Então** o sistema deve criar meu perfil com nível de segurança L3.
- **E** disparar um e-mail de verificação.
- **E** redirecionar para o onboarding inicial.

### Cenário: Tentativa com E-mail Duplicado
- **Dado** que o e-mail "usuario@synq.com" já existe no sistema.
- **Quando** tento registrar uma nova conta com este e-mail.
- **Então** o sistema não deve confirmar a existência do e-mail (por segurança), mas sim informar que "Se este e-mail estiver registrado, você receberá um link de recuperação".

---

## RF-002: Autenticação Segura
**Como** um usuário registrado,
**quero** realizar login de forma segura,
**para** acessar meus workspaces privados.

### Cenário: Login Válido
- **Dado** que possuo uma conta verificada.
- **Quando** insiro minhas credenciais corretas.
- **Então** o sistema deve gerar um JWT (L4) de curta duração.
- **E** fornecer um Refresh Token rotativo.
- **E** permitir acesso ao dashboard principal.

---

## RF-003: Gestão de Sessão (Zero Trust)
**Como** um usuário autenticado,
**quero** que minha sessão expire por inatividade,
**para** proteger meus dados caso eu esqueça o navegador aberto.

### Cenário: Expiração por Inatividade
- **Dado** que estou logado e inativo por mais de 30 minutos.
- **Quando** tento realizar qualquer ação que exija o token.
- **Então** o sistema deve invalidar a sessão atual.
- **E** solicitar reautenticação.

---

## Matriz de Edge Cases
| Casuística | Comportamento Esperado | Código de Erro |
| :--- | :--- | :--- |
| Senha fraca (<12 chars) | Rejeitar com mensagem de política de senha | `AUTH_WEAK_PASSWORD` |
| Token JWT expirado | Tentar refresh automático via Refresh Token | `AUTH_TOKEN_EXPIRED` |
| Refresh Token inválido | Forçar logout completo do usuário | `AUTH_SESSION_INVALID` |
| Múltiplas falhas de login | Bloqueio temporário de IP e alerta no log DSO | `AUTH_BRUTE_FORCE_DETECTED` |

---
> **Status:** Pronto para revisão técnica do [SA] e [DSO].
