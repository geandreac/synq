# ADR-0002: Arquitetura de Dados e Modelagem de Persistência

## Status
Proposto

## Contexto
O projeto SYNQ requer uma estrutura de dados robusta para suportar colaboração em tempo real, hierarquia de permissões (RBAC) e o fluxo Kanban. Precisamos decidir sobre o paradigma de banco de dados e o esquema inicial.

## Decisões

### 1. Paradigma: Relacional (SQL)
Optamos por um banco de dados relacional para o core do sistema.
- **Justificativa:** A integridade referencial é crítica para o sistema de permissões (RBAC). A complexidade dos relacionamentos entre usuários, workspaces e membros é melhor gerenciada por um motor SQL.
- **Trade-off:** Menor flexibilidade de schema comparado a NoSQL, mas maior segurança e consistência ACID.

### 2. Modelagem das Entidades Principais
- **User:** Identidade (Email, Hash L4, MFA status).
- **Workspace:** Entidade raiz para colaboração.
- **WorkspaceMember:** Tabela de junção entre User e Workspace, armazenando o `Role` (RBAC).
- **Board:** Pertence a um Workspace.
- **List:** Colunas dentro de um Board.
- **Card:** Tarefa atômica.
- **TaskItem:** Itens de checklist dentro de um Card.

### 3. Classificação e Proteção de Dados
- Campos de e-mail e nomes serão protegidos por criptografia AES-256 em repouso.
- Senhas utilizarão Argon2id.
- Toda query de acesso a Board/Card deve obrigatoriamente realizar um `JOIN` com `WorkspaceMember` para validar o acesso do usuário atual (Zero Trust no nível da query).

### 4. Sincronização em Tempo Real
Para o MVP, utilizaremos a estratégia de **Trava Otimista** via coluna `version` em cada entidade para evitar sobreposição de escritas em ambientes colaborativos.

## Consequências
- Garantia de integridade nos fluxos de permissão.
- Facilidade de auditoria e relatórios.
- Necessidade de migrations rigorosas para qualquer alteração de schema.
