# ADR-0001: Definição de Escopo e Objetivos do Projeto SYNQ

## Status
Aceito

## Contexto
O projeto SYNQ visa criar uma plataforma de gestão de fluxos de trabalho baseada na web, utilizando a metodologia Kanban. É necessário definir o que está dentro e fora do escopo inicial para garantir o foco no MVP (Minimum Viable Product).

## Decisões

### 1. Foco no MVP (Core Features)
O MVP focará nos pilares de Identidade, Espaços de Trabalho Colaborativos e Organização Visual (Kanban).
- **Identidade:** Autenticação segura (L4) e gestão de perfis.
- **Workspaces:** Criação de áreas isoladas com controle de acesso (RBAC).
- **Kanban Engine:** Fluxo de Quadros -> Listas -> Cartões com arrastar e soltar.
- **Task Management:** Detalhes de tarefas (Checklists, Due Dates, Responsáveis).

### 2. Escopo Negativo (Out of Scope)
Para acelerar o time-to-market, os seguintes itens estão excluídos da primeira versão:
- Integrações nativas (Slack, GCal).
- Mobile nativo (foco em Web Responsive).
- Automações de workflow.
- Modo offline persistente.

### 3. Segurança por Design
Toda decisão seguirá a classificação de dados L1-L5 e o princípio de Zero Trust.

## Consequências
- Foco total na robustez do fluxo de trabalho e segurança dos dados.
- Necessidade de uma arquitetura Web altamente responsiva.
- Possível frustração de usuários que buscam automações complexas de imediato.
