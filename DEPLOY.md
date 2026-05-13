# 🚀 Guia de Deploy - SYNQ Productivity Platform

Este guia descreve o processo de configuração do banco de dados e deploy da aplicação em ambiente de produção/testes.

## 1. Banco de Dados (Neon PostgreSQL)

O SYNQ utiliza PostgreSQL. Recomendamos o **Neon** pela facilidade de uso e suporte nativo a Serverless.

1.  Acesse [neon.tech](https://neon.tech) e crie uma conta.
2.  Crie um novo projeto chamado `synq`.
3.  No Dashboard do Neon, localize a seção **Connection String**.
4.  Certifique-se de que a opção **Pooled Connection** esteja ativada (se disponível) ou use a string padrão.
5.  Sua URL será algo como:
    `postgresql://user:password@ep-cool-darkness-123.us-east-2.aws.neon.tech/neondb?sslmode=require`
6.  **Importante**: Guarde esta URL para o próximo passo.

---

## 2. Preparação do Repositório

Antes de subir para a nuvem, certifique-se de que seu código está no GitHub:

```bash
git add .
git commit -m "chore: preparation for deploy and pwa"
git push origin main
```

---

## 3. Deploy no Render (Recomendado)

O **Render** é uma excelente plataforma para o nosso modelo de arquitetura (Hono Backend servindo Vite Frontend).

### Passos:
1.  Crie uma conta em [render.com](https://render.com).
2.  Clique em **New +** e selecione **Web Service**.
3.  Conecte seu repositório do GitHub.
4.  Configure os detalhes do serviço:
    - **Name**: `synq-platform`
    - **Environment**: `Node`
    - **Build Command**: `npm run build`
    - **Start Command**: `npm start`
5.  Clique em **Advanced** para adicionar as **Environment Variables**:

| Variável | Valor sugerido |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | *Sua URL do Neon (passo 1)* |
| `JWT_SECRET` | *Uma string longa e aleatória (ex: `openssl rand -base64 32`)* |
| `VITE_API_URL` | *A URL final do seu app no Render (ex: `https://synq.onrender.com`)* |
| `ARGON2_MEMORY_COST` | `65536` |

6.  Clique em **Create Web Service**.

---

## 4. Verificação

Após o término do build no Render:
1.  Acesse a URL gerada (ex: `https://synq.onrender.com`).
2.  Verifique se o health check responde em `/health`.
3.  O Frontend deve carregar automaticamente na rota raiz `/`.

---

## 💡 Notas Adicionais

### Erros comuns no Build local
Se você tentar rodar `npm run build` localmente, o Prisma exigirá que a variável `DATABASE_URL` esteja definida no seu arquivo `.env` local ou no terminal.

**Para rodar o build localmente (apenas para teste):**
```powershell
# Windows PowerShell
$env:DATABASE_URL="sua_url_aqui"; npm run build
```

### PWA
O sistema já está configurado como PWA. Ao acessar a URL de produção pelo celular (Chrome ou Safari), você verá a opção "Adicionar à tela de início".

---

## 🛠️ Descrição para o GitHub (README)

Se desejar atualizar o seu README principal, aqui está uma descrição sugerida:

# 🏗️ SYNQ - Industrial Productivity Platform

**SYNQ** é uma plataforma de produtividade de alto desempenho projetada sob a estética **Industrial Brutalist**. O sistema combina uma arquitetura modular robusta com uma interface de alta fidelidade para gestão de fluxos de trabalho complexos.

### 🚀 Principais Funcionalidades
- **🛠️ Gestão de Workspaces**: Crie e gerencie múltiplos ambientes de trabalho isolados.
- **📋 Kanban Dinâmico**: Sistema de quadros interativos com suporte a Drag & Drop em tempo real.
- **🛡️ Segurança L4**: Autenticação parametrizada com Argon2id, conformidade com políticas de segurança de nível industrial.
- **📱 PWA Nativo**: Instale o SYNQ no seu Desktop ou Mobile com suporte a cache inteligente.
- **👥 Gestão de Membros**: Controle de acesso baseado em cargos (RBAC) e sistema de convites.

### 🧪 Stack Tecnológica
- **Backend**: [Hono](https://hono.dev/) (Runtime: Node.js) - Minimalista e ultrarrápido.
- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) + Vanilla CSS (Design Systems Customizados).
- **ORM**: [Prisma](https://www.prisma.io/) com PostgreSQL.
- **DND**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) para interatividade de quadros.
- **Auth**: JWT + Argon2 para proteção de dados.

### 🎨 Design Philosophy
O SYNQ foge dos designs genéricos de SaaS. Utilizamos uma paleta de cores de alto contraste (**Industrial Yellow & Coal Black**), tipografia técnica e micro-interações fluidas para proporcionar uma sensação de ferramenta de precisão.
