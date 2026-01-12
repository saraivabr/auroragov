# ✅ Checklist de Próximos Passos - Aurora Gov

Este documento lista as ações necessárias para tornar o Aurora Gov totalmente operacional em produção.

## 🚀 Ações Imediatas (Próximas 24h)

### 1. Instalar Dependências de Desenvolvimento

```bash
npm install --save-dev \
  @testing-library/jest-dom@^6.1.5 \
  @testing-library/react@^14.1.2 \
  @testing-library/user-event@^14.5.1 \
  @typescript-eslint/eslint-plugin@^6.21.0 \
  @typescript-eslint/parser@^6.21.0 \
  eslint@^8.56.0 \
  eslint-plugin-react-hooks@^4.6.0 \
  eslint-plugin-react-refresh@^0.4.5 \
  @vitest/ui@^1.0.4 \
  jsdom@^23.0.1 \
  prettier@^3.1.1 \
  vitest@^1.0.4
```

**Por que:** Essas dependências são necessárias para testes, linting e formatação.

**Verificação:**
```bash
npm run lint       # Deve executar sem erros
npm run format     # Deve formatar código
npm test          # Deve executar testes
```

---

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o template
cp .env.example .env

# Edite com suas credenciais
nano .env  # ou use seu editor preferido
```

**Variáveis Essenciais:**
```env
# Supabase (OBRIGATÓRIO)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# APIs de IA (pelo menos uma OBRIGATÓRIA)
VITE_OPENAI_API_KEY=sk-proj-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GOOGLE_API_KEY=AIza...
VITE_DEEPSEEK_API_KEY=sk-...
```

**Verificação:**
```bash
# Verificar se variáveis estão carregando
npm run dev
# Abra console do navegador e verifique
```

---

### 3. Verificar Build e Qualidade

```bash
# Verificar build
npm run build

# Executar linter
npm run lint

# Verificar formatação
npm run format:check

# Executar testes
npm test
```

**Todos os comandos devem executar sem erros.**

---

## 📅 Fase 1: Backend e Autenticação (Semana 1-2)

### 1. Configurar Supabase Completamente

- [ ] Criar projeto no Supabase
- [ ] Copiar URL e Keys para `.env`
- [ ] Executar migrações existentes
- [ ] Configurar Row Level Security (RLS)
- [ ] Testar conexão

**Arquivo:** `SUPABASE_INTEGRATION.md` tem instruções detalhadas

**Comandos:**
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-projeto-ref

# Rodar migrações
supabase db push
```

---

### 2. Implementar Autenticação

- [ ] Configurar Supabase Auth
- [ ] Implementar login/logout
- [ ] Implementar registro de usuários
- [ ] Adicionar gerenciamento de sessão
- [ ] Testar fluxo completo

**Componentes a criar:**
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/contexts/AuthContext.tsx`
- `src/hooks/useAuth.ts`

**Referência:**
```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Implement signIn, signOut, etc...
  
  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

### 3. Integrar API de IA (pelo menos OpenAI)

- [ ] Instalar SDK do OpenAI
- [ ] Criar função de integração
- [ ] Testar chamada de API
- [ ] Implementar tratamento de erros
- [ ] Adicionar rate limiting básico

**Instalação:**
```bash
npm install openai
```

**Implementação:**
```typescript
// src/lib/ai/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // APENAS para desenvolvimento!
});

export async function sendMessageToOpenAI(message: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: message }],
      max_tokens: 1000,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Error:', error);
    throw error;
  }
}
```

**⚠️ IMPORTANTE:** Em produção, as chamadas de API devem ser feitas no backend (Supabase Edge Functions), não no cliente!

---

## 📅 Fase 2: Funcionalidades Core (Semana 3-4)

### 1. Persistência de Conversas

- [ ] Criar tabela `conversations` no Supabase
- [ ] Criar tabela `messages` no Supabase
- [ ] Implementar salvamento automático
- [ ] Implementar carregamento de histórico
- [ ] Testar CRUD completo

**Schema SQL:**
```sql
-- conversations table
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  model text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- messages table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  model text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

### 2. Audit Logs Persistentes

- [ ] Criar tabela `audit_logs` no Supabase
- [ ] Implementar logging automático
- [ ] Adicionar filtros e busca
- [ ] Implementar exportação (PDF/CSV)
- [ ] Testar retenção de logs

**Schema SQL:**
```sql
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  action text not null,
  model text,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

### 3. Exportação Real de Documentos

- [ ] Implementar exportação PDF
- [ ] Implementar exportação DOCX
- [ ] Implementar exportação TXT
- [ ] Adicionar template de documento
- [ ] Testar downloads

**Bibliotecas sugeridas:**
```bash
npm install jspdf
npm install docx
```

---

## 📅 Fase 3: Segurança (Semana 5-6)

### 1. Content Security Policy (CSP)

- [ ] Adicionar CSP no `index.html`
- [ ] Configurar nonces para scripts inline
- [ ] Testar políticas restritivas
- [ ] Configurar reportes de violação

**Exemplo:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

---

### 2. Rate Limiting

- [ ] Implementar rate limiting no Supabase
- [ ] Adicionar throttling no frontend
- [ ] Configurar limites por usuário
- [ ] Adicionar mensagens de erro claras

**Exemplo com Supabase Edge Functions:**
```typescript
import { createClient } from '@supabase/supabase-js';

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 10;

export async function checkRateLimit(userId: string) {
  // Implementar lógica de rate limiting
}
```

---

### 3. Sanitização de Inputs

- [ ] Instalar biblioteca de sanitização
- [ ] Sanitizar todos os inputs de usuário
- [ ] Sanitizar respostas de IA
- [ ] Testar contra XSS

**Instalação:**
```bash
npm install dompurify
npm install @types/dompurify --save-dev
```

**Uso:**
```typescript
import DOMPurify from 'dompurify';

const cleanContent = DOMPurify.sanitize(userInput);
```

---

## 📅 Fase 4: Testes (Semana 7-8)

### 1. Expandir Cobertura de Testes

- [ ] Testes para todos os componentes principais
- [ ] Testes de integração
- [ ] Testes de hooks
- [ ] Coverage > 70%

**Componentes prioritários:**
1. Dashboard.tsx
2. ChatInterface.tsx
3. ModelSelector.tsx
4. TemplateLibrary.tsx
5. AuditTrail.tsx

---

### 2. Testes E2E

- [ ] Instalar Playwright
- [ ] Criar cenários de teste
- [ ] Testar fluxo completo de usuário
- [ ] Configurar CI para E2E

**Instalação:**
```bash
npm install -D @playwright/test
npx playwright install
```

---

### 3. Testes de Acessibilidade

- [ ] Instalar axe-core
- [ ] Testar todos os componentes
- [ ] Corrigir problemas encontrados
- [ ] Documentar melhorias

**Instalação:**
```bash
npm install -D @axe-core/react
```

---

## 📅 Fase 5: Deploy em Produção (Semana 9-10)

### 1. Preparar Ambiente de Produção

- [ ] Configurar domínio
- [ ] Configurar certificado SSL
- [ ] Configurar DNS
- [ ] Testar acesso

---

### 2. Deploy Inicial

- [ ] Deploy em staging primeiro
- [ ] Testes completos em staging
- [ ] Deploy em produção
- [ ] Monitoramento ativo

**Plataformas sugeridas:**
1. **Vercel** (mais fácil, recomendado)
2. **Netlify** (alternativa)
3. **AWS** (mais controle)

---

### 3. Configurar Monitoramento

- [ ] Configurar Sentry para error tracking
- [ ] Configurar analytics
- [ ] Configurar alertas
- [ ] Configurar uptime monitoring

**Instalação Sentry:**
```bash
npm install @sentry/react
```

---

## 🔄 Manutenção Contínua

### Semanalmente

- [ ] Revisar logs de erro
- [ ] Verificar usage de APIs
- [ ] Atualizar dependências (se necessário)
- [ ] Backup de banco de dados

### Mensalmente

- [ ] Auditoria de segurança
- [ ] Revisão de performance
- [ ] Análise de feedback de usuários
- [ ] Planejamento de melhorias

---

## 📊 Métricas de Sucesso

### Técnicas

- ✅ Uptime > 99.9%
- ✅ Tempo de resposta < 200ms
- ✅ Coverage de testes > 70%
- ✅ 0 vulnerabilidades críticas

### Negócio

- ✅ > 100 usuários ativos
- ✅ > 1000 conversas/dia
- ✅ NPS > 70
- ✅ Taxa de adoção > 80%

---

## 🆘 Troubleshooting

### Build Falha

```bash
# Limpar cache
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Testes Falhando

```bash
# Verificar setup
npm test -- --run
npm run test:ui
```

### Variáveis de Ambiente Não Carregam

```bash
# Verificar prefixo VITE_
# Reiniciar servidor
npm run dev
```

---

## 📞 Suporte

- 📧 Email: suporte@auroragov.br
- 🐛 Issues: [GitHub Issues](https://github.com/saraivabr/auroragov/issues)
- 📚 Docs: Ver arquivos README, DEPLOYMENT.md, TESTING.md

---

**Última Atualização:** 06 de Janeiro de 2026  
**Status:** ✅ Checklist Ativo  
**Progresso:** 20% (estrutura completa)
