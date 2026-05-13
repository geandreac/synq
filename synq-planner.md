# 📅 SYNQ-PLANNER.MD — Plano Diretor do Projeto SYNQ

[ATUANDO COMO: PROJECT PLANNER]

## 1. VISÃO GERAL
Desenvolvimento de uma plataforma web de produtividade ("SYNQ") focada em organização visual através da metodologia Kanban (quadros, listas e cartões), com forte ênfase em colaboração em tempo real e segurança por design.

- **Tipo de Projeto:** WEB (Single Page Application / PWA)
- **Status:** Planejamento Inicial (Fase 1)
- **Classificação de Segurança:** Nível L3/L4 (Dados Confidenciais e Restritos)

---

## 2. CRITÉRIOS DE SUCESSO (MVP)
1.  Usuários podem se cadastrar, autenticar e gerenciar seus perfis com segurança.
2.  Capacidade de criar múltiplos Espaços de Trabalho (Workspaces).
3.  Colaboração real: convite de membros e restrição de acesso baseada em permissões (RBAC).
4.  Fluxo Kanban funcional: Quadros → Listas → Cartões.
5.  Cartões com suporte a: Descrição, Responsáveis, Checklists e Prazos.

---

## 3. ESCOPO NEGATIVO (O que NÃO faremos no MVP)
- Integrações nativas com terceiros (Slack, Google Calendar, etc.).
- Aplicativos móveis nativos (iOS/Android) — foco em Web Responsive.
- Automações de fluxo (regras "se isto, então aquilo").
- Modo offline completo (Persistência local avançada).
- Dashboards de BI e relatórios de produtividade complexos.
- Upload de arquivos pesados (> 10MB).

---

## 4. 🔐 SEGURANÇA POR DESIGN & CLASSIFICAÇÃO DE DADOS

### 4.1 Classificação de Dados (Mínimo Obrigatório)
| Dado | Classificação | Medidas |
| :--- | :--- | :--- |
| Credenciais (Hashes de senha) | **L4 (Restrito)** | Argon2id/Bcrypt + Salt robusto |
| Sessões/Tokens de Acesso | **L4 (Restrito)** | JWT com expiração curta + Refresh tokens rotativos |
| E-mails e Perfis de Usuário | **L3 (Confidencial)** | Criptografia em trânsito e repouso |
| Conteúdo dos Quadros/Cartões | **L3 (Confidencial)** | RBAC estrito (Acesso apenas a membros autorizados) |
| Logs de Auditoria | **L2 (Interno)** | Imutabilidade e monitoramento de anomalias |

### 4.2 Modelo de Acesso (RBAC)
- **Admin do Workspace:** Controle total (membros, faturamento, deleção).
- **Membro:** Criação e edição de quadros/cartões.
- **Leitor:** Visualização apenas (Read-only).
- **Convidado Externo:** Acesso restrito a quadros específicos.

---

## 5. RISK REGISTER INICIAL

| ID | Risco | Prob. | Impacto | Mitigação | Dono |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **R01** | Vazamento de dados via IDOR em Workspaces | Média | Crítico | Middleware de autorização em cada requisição (Zero Trust) | DSO |
| **R02** | Conflitos de edição simultânea | Alta | Médio | Implementação de trava otimista ou CRDTs (lógica de sync) | SA |
| **R03** | Injeção de scripts (XSS) em cartões | Média | Alto | Sanitização rigorosa de entradas de texto rico | FE |
| **R04** | Exposição de segredos em logs | Baixa | Crítico | Filtros de redação em bibliotecas de log | BE |

---

## 6. DECOMPOSIÇÃO DE TAREFAS (TASK BREAKDOWN)

As tarefas seguem o padrão: **INPUT → OUTPUT → VERIFY**.

### FASE 1: Identidade e Acesso (Core Auth)
1.  **Tarefa:** Design do sistema de Autenticação.
    - **Agente:** `[SA]` + `[DSO]`
    - **Input:** Requisitos de segurança (RS-01 a RS-08).
    - **Output:** Fluxogramas de Auth (Signup, Login, Refresh).
    - **Verify:** Gate 1 de segurança aprovado.
2.  **Tarefa:** Implementação do Core de Autenticação.
    - **Agente:** `[BE]` + `[FE]`
    - **Input:** Design aprovado.
    - **Output:** Endpoints de Auth + Telas de Login/Registro.
    - **Verify:** Testes unitários e integração com 100% de cobertura nos caminhos críticos.

### FASE 2: Estrutura de Colaboração (Workspaces & RBAC)
1.  **Tarefa:** Modelagem do Schema de Dados para Workspaces e Membros.
    - **Agente:** `[DB]`
    - **Input:** Requisitos de RBAC.
    - **Output:** Schema SQL/NoSQL com tabelas de Workspace, Users, Permissions.
    - **Verify:** EXPLAIN ANALYZE em queries de busca de permissão.
2.  **Tarefa:** Lógica de Gerenciamento de Espaços e Convites.
    - **Agente:** `[BE]`
    - **Input:** Schema aprovado.
    - **Output:** API de CRUD de Workspace + Fluxo de convite via e-mail.
    - **Verify:** Testes de tentativa de acesso cross-workspace (IDOR check).

### FASE 3: O Coração do Produto (Kanban Engine)
1.  **Tarefa:** Arquitetura da Interface Kanban (Boards/Lists/Cards).
    - **Agente:** `[UX]` + `[FE]`
    - **Input:** Especificação funcional de visualização por colunas.
    - **Output:** Wireframes + Component Tree (Drag & Drop logic).
    - **Verify:** Protótipo de baixa fidelidade validado pelo PO.
2.  **Tarefa:** Implementação do fluxo de Cartões e Tarefas.
    - **Agente:** `[FE]` + `[BE]`
    - **Input:** Wireframes + API de Workspaces.
    - **Output:** CRUD completo de Boards, Listas e Cartões com persistência.
    - **Verify:** Smoke tests em fluxos de criação e movimentação de cartões.

### FASE 4: Detalhes e Prazos (Task Management)
1.  **Tarefa:** Implementação de Checklists e Metadados de Cartão.
    - **Agente:** `[FE]` + `[BE]`
    - **Input:** Requisitos de gerenciamento de tarefas (Checklists, Due Dates).
    - **Output:** Modal de detalhes do cartão funcional.
    - **Verify:** Validação de datas (passado vs futuro) e delegação de responsáveis.

---

## 7. FASE X: VERIFICAÇÃO FINAL
- [ ] Executar Gate 1 (Design) para todos os componentes.
- [ ] Validar conformidade com OWASP Top 10:2025.
- [ ] Testes E2E cobrindo 100% dos fluxos de colaboração.
- [ ] Auditoria de design tokens e acessibilidade (WCAG AA).

---
> **Próxima Ação:** Após aprovação deste plano, invocar o `[SA]` para o primeiro ADR de arquitetura de dados e `[PO]` para detalhamento dos critérios BDD da Fase 1.
