# SYNQ Design System: Fundações Visuais

[ATUANDO COMO: UX/UI PRODUCT DESIGNER]

## 1. CONCEITO VISUAL: "FLOW & FOCUS"
O SYNQ utiliza uma estética **Industrial Brutalist Modern**: superfícies limpas, tipografia forte e bordas nítidas para transmitir precisão e produtividade, equilibradas com micro-interações fluidas para não sobrecarregar a carga cognitiva.

---

## 2. DESIGN TOKENS

### 2.1 Cores (HSL Tailored)
| Token | Valor | Uso |
| :--- | :--- | :--- |
| `base-black` | `hsl(240, 10%, 4%)` | Fundo principal (Modo Dark) |
| `surface-1` | `hsl(240, 6%, 10%)` | Cartões e containers |
| `surface-2` | `hsl(240, 6%, 15%)` | Hover e estados de destaque |
| `primary` | `hsl(260, 80%, 65%)` | Ações principais (Synq Purple) |
| `accent` | `hsl(180, 70%, 50%)` | Sucesso e indicadores de progresso |
| `text-high` | `hsl(0, 0%, 98%)` | Títulos e leitura principal |
| `text-low` | `hsl(0, 0%, 65%)` | Metadados e placeholders |

### 2.2 Tipografia (Google Fonts)
- **Principal:** `Inter` (sans-serif) para interface e leitura.
- **Destaque:** `Outfit` (sans-serif) para títulos e marca.
- **Baseline:** 16px (1rem).

---

## 3. WIREFRAMES TEXTUAIS (FASE 1 & CORE)

### 3.1 Tela de Login / Cadastro
```
+---------------------------------------+
|                [ SYNQ ]               |
|         Organize seu fluxo.           |
|                                       |
|  [ E-mail                     ]       |
|  [ Senha                      ]       |
|                                       |
|  [        ENTRAR NA PLATAFORMA       ]|
|                                       |
|    Não tem conta? [Crie aqui]         |
+---------------------------------------+
```
*Justificativa UX:* Foco total no formulário. Sem distrações laterais. Lei de Hick: reduzir o número de estímulos para acelerar a conversão.

### 3.2 Dashboard Kanban (Estrutura Base)
```
+---------------------------------------+
| [S] [ Workspace A v ]       (U) (U) [+] | <-- Top Bar (RBAC & Members)
+---------------------------------------+
| [ Board Alpha v ]                     | <-- Sub Bar (Nav)
+---------------------------------------+
| +----------+  +----------+  +----------+|
| | Backlog  |  | In Dev   |  | Done     ||
| +----------+  +----------+  +----------+|
| | [ Card ] |  | [ Card ] |  | [ Card ] ||
| | [ Card ] |  |          |  | [ Card ] ||
| | [+] Add  |  | [+] Add  |  |          ||
| +----------+  +----------+  +----------+|
+---------------------------------------+
```
*Justificativa UX:* 
- **Hierarquia Visual:** Títulos de lista com contraste alto.
- **Lei de Fitts:** Botões de [+] em posições consistentes para fácil acesso.
- **Touch Targets:** Mínimo de 44px em todos os elementos de interação.

---
> **Próxima Ação:** Tradução destes tokens para CSS Variables no diretório `src/shared/styles/`.
