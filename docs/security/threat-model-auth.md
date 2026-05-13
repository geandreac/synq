# Threat Model: Sistema de Autenticação e Identidade (Fase 1)

[ATUANDO COMO: DSO / DEVSECOPS]

## 1. ANÁLISE STRIDE
Aplicado ao fluxo de Identidade e Acesso definido no BDD da Fase 1.

| Ameaça | Descrição | Mitigação Proposta |
| :--- | :--- | :--- |
| **S (Spoofing)** | Atacante se passando por usuário legítimo via roubo de token. | Refresh tokens rotativos + Validação de User-Agent/IP. |
| **T (Tampering)** | Adulteração do payload JWT para escalar privilégios. | Assinatura RS256/EdDSA + Validação rigorosa de claims no backend. |
| **R (Repudiation)** | Usuário nega ter realizado alteração crítica em workspace. | Log de auditoria assinado e imutável para ações L3+. |
| **I (Info Disclosure)** | Vazamento de hashes de senha ou e-mails. | Criptografia Argon2id + AES-256-GCM em repouso. Redação de logs. |
| **D (DoS)** | Brute force no endpoint de login para derrubar o serviço. | Rate Limiting agressivo + CAPTCHA progressivo + WAF na borda. |
| **E (Elev. Privilege)** | Usuário Member alterando configurações de Admin. | Validação RBAC em nível de serviço e query (Zero Trust). |

---

## 2. GATES DE SEGURANÇA (PIPELINE)
Para que o código da Fase 1 avance, estes gates devem estar configurados:

1.  **SAST (Static Analysis):** Bloqueio imediato para padrões de SQL Injection ou uso de bibliotecas de crypto obsoletas.
2.  **SCA (Supply Chain):** Zero CVEs críticos em bibliotecas de autenticação/JWT.
3.  **Secret Scan:** Bloqueio de commits contendo chaves privadas de assinatura JWT ou salts de banco.
4.  **Dast / Pentest:** Teste automatizado de Session Fixation e Insecure Direct Object Reference (IDOR).

---

## 3. CHECKLIST DE CONFORMIDADE L1-L5
- [x] **L4:** Senhas armazenadas com Argon2id (mín. 12 iterations).
- [x] **L4:** Refresh tokens persistidos apenas como hashes.
- [x] **L3:** E-mails ofuscados em logs de debug.
- [x] **RS-03:** Sessão expira em 30 min por padrão.

---
> **Parecer DSO:** Requisitos validados. O plano de mitigação para as ameaças identificadas está alinhado com o framework Regras.md. **APROVADO PARA DESENVOLVIMENTO.**
