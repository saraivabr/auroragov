# Guia de Deploy - Assistente Governamental IA

Este documento descreve o processo completo de deploy da aplicação em produção.

## Pré-requisitos

- Conta Supabase (gratuito para começar)
- Conta OpenAI com chave API
- Conta Vercel/Netlify (opcional, para hospedagem frontend)
- Node.js 18+ instalado localmente

## Passo 1: Configuração do Supabase

### 1.1 Criar Projeto no Supabase

1. Acesse https://supabase.com
2. Clique em "New Project"
3. Preencha:
   - Nome: `assistente-governamental-prod`
   - Password: [senha forte]
   - Região: `South America (São Paulo)` (para melhor latência no Brasil)
4. Aguarde a criação do projeto (~2 minutos)

### 1.2 Configurar Variáveis de Ambiente

No painel do Supabase, vá em **Settings > API** e copie:
- `Project URL` → VITE_SUPABASE_URL
- `anon/public` key → VITE_SUPABASE_ANON_KEY
- `Project ID` → SUPABASE_PROJECT_ID

### 1.3 Executar Migrations

```bash
npx supabase login
npx supabase link --project-ref [PROJECT_ID]
npx supabase db push
```

Isso criará todas as tabelas necessárias:
- `consultas_juridicas`
- `analises_documentos`
- `documentos_oficiais`
- `base_normativa`
- E todas as políticas RLS

### 1.4 Configurar Edge Functions

#### Método 1: Deploy via CLI (Recomendado)
```bash
npx supabase functions deploy consulta-juridica
npx supabase functions deploy analise-documentos
npx supabase functions deploy gerador-documentos
```

#### Método 2: Deploy pelo Dashboard
1. Vá em **Edge Functions** no dashboard
2. Clique em "Create a new function"
3. Cole o código de cada função
4. Defina as variáveis de ambiente

### 1.5 Configurar Secrets das Edge Functions

```bash
npx supabase secrets set OPENAI_API_KEY=sk-proj-...
```

Ou pelo dashboard:
1. **Edge Functions > [Nome da função] > Settings**
2. Adicione `OPENAI_API_KEY` com sua chave

## Passo 2: Configuração do OpenAI

### 2.1 Obter Chave API

1. Acesse https://platform.openai.com
2. Vá em **API Keys**
3. Clique em "Create new secret key"
4. Copie e guarde a chave (não será mostrada novamente)

### 2.2 Configurar Limites

Para controlar custos:
1. Vá em **Usage Limits**
2. Configure:
   - Hard limit: $100/mês (ajuste conforme necessário)
   - Email notifications: Ative alertas em 50%, 75%, 90%

### 2.3 Testar Chave

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-proj-..."
```

## Passo 3: Build e Deploy do Frontend

### 3.1 Preparar Ambiente Local

Crie arquivo `.env` na raiz:
```env
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_PROJECT_ID=[project-id]
OPENAI_API_KEY=sk-proj-...
VITE_OPENAI_MODEL=gpt-4o-mini
```

### 3.2 Testar Localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:5173 e teste:
- [ ] Login/Cadastro funciona
- [ ] Dashboard carrega estatísticas
- [ ] Consulta jurídica retorna respostas
- [ ] Análise de documentos funciona
- [ ] Gerador de documentos cria arquivos

### 3.3 Build de Produção

```bash
npm run build
```

Isso gera a pasta `dist/` com arquivos otimizados.

### 3.4 Deploy na Vercel

#### Via CLI:
```bash
npm install -g vercel
vercel --prod
```

#### Via Dashboard:
1. Acesse https://vercel.com
2. Clique em "New Project"
3. Conecte seu repositório Git
4. Configure variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_PROJECT_ID`
   - `VITE_OPENAI_MODEL`
5. Deploy automático!

### 3.5 Deploy na Netlify

#### Via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Via Dashboard:
1. Acesse https://netlify.com
2. Arraste a pasta `dist/` para o dropzone
3. Configure variáveis de ambiente no dashboard
4. Pronto!

## Passo 4: Configurações de Segurança

### 4.1 Configurar CORS no Supabase

As Edge Functions já têm CORS configurado. Verifique:
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};
```

### 4.2 Configurar RLS (Row Level Security)

Todas as tabelas já têm RLS habilitado via migrations. Verifique no dashboard:
1. **Table Editor > [Tabela] > RLS**
2. Deve estar "Enabled"
3. Deve ter políticas para SELECT, INSERT, UPDATE, DELETE

### 4.3 Configurar Autenticação

No Supabase Dashboard:
1. **Authentication > Settings**
2. Configurações recomendadas:
   - Site URL: `https://seudominio.com`
   - Redirect URLs: `https://seudominio.com/**`
   - Email confirmação: **Desabilitado** (mais fácil para testes)
   - Enable password recovery: **Habilitado**

## Passo 5: Monitoramento e Logs

### 5.1 Logs do Supabase

Acesse logs em tempo real:
```bash
npx supabase functions logs consulta-juridica --follow
```

Ou pelo dashboard: **Edge Functions > [Função] > Logs**

### 5.2 Logs da OpenAI

1. Acesse https://platform.openai.com/usage
2. Monitore:
   - Número de requests
   - Tokens usados
   - Custos acumulados

### 5.3 Analytics

Adicione Google Analytics (opcional):
```html
<!-- Adicione no index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Passo 6: Backup e Recuperação

### 6.1 Backup Automático (Supabase Pro)

Com plano Pro, backups diários automáticos.

### 6.2 Backup Manual

```bash
npx supabase db dump -f backup.sql
```

### 6.3 Restaurar Backup

```bash
psql -h db.[project-id].supabase.co -U postgres -d postgres -f backup.sql
```

## Passo 7: Testes em Produção

### 7.1 Checklist de Validação

Execute estes testes após o deploy:

- [ ] **Autenticação**
  - [ ] Cadastro de novo usuário
  - [ ] Login com credenciais
  - [ ] Recuperação de senha
  - [ ] Logout

- [ ] **Dashboard**
  - [ ] Estatísticas carregam corretamente
  - [ ] Cards de funcionalidades clicáveis
  - [ ] Histórico de atividades aparece

- [ ] **Consulta Jurídica**
  - [ ] Fazer pergunta simples
  - [ ] Receber resposta com fundamentação
  - [ ] Enviar feedback (positivo/negativo)
  - [ ] Verificar histórico

- [ ] **Análise de Documentos**
  - [ ] Upload de texto
  - [ ] Análise completa (resumo, pontos críticos, checklist, riscos)
  - [ ] Navegação entre abas
  - [ ] Exportação de relatório

- [ ] **Gerador de Documentos**
  - [ ] Selecionar template
  - [ ] Preencher campos
  - [ ] Gerar documento
  - [ ] Melhorar texto com IA
  - [ ] Copiar/Imprimir/Baixar
  - [ ] Salvar no banco

### 7.2 Testes de Performance

```bash
npx lighthouse https://seudominio.com --view
```

Metas:
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

## Passo 8: Manutenção

### 8.1 Atualizações de Dependências

```bash
npm outdated
npm update
npm run build
npm run preview  # Testar antes de fazer deploy
```

### 8.2 Atualizações de Segurança

```bash
npm audit
npm audit fix
```

### 8.3 Monitoramento de Custos

**OpenAI:**
- Configurar alertas em 50%, 75%, 90% do budget
- Revisar usage semanalmente
- Otimizar prompts se necessário

**Supabase:**
- Plano gratuito: até 500MB
- Upgrade para Pro ($25/mês) quando necessário
- Monitorar storage e database size

## Passo 9: Suporte e Troubleshooting

### Problemas Comuns

#### 1. "Authentication error" ao fazer login

**Solução:**
- Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
- Confirme que RLS está habilitado
- Verifique políticas de acesso

#### 2. Edge Functions retornam erro 500

**Solução:**
- Verifique logs: `npx supabase functions logs [function-name]`
- Confirme que OPENAI_API_KEY está configurada
- Teste chave OpenAI manualmente

#### 3. "Quota exceeded" da OpenAI

**Solução:**
- Verifique usage em https://platform.openai.com/usage
- Aumente hard limit se necessário
- Adicione créditos na conta

#### 4. Dados não aparecem no dashboard

**Solução:**
- Verifique se migrations foram executadas
- Confirme políticas RLS
- Teste queries no SQL Editor do Supabase

## Passo 10: Documentação para Usuários

Crie documentação interna com:
1. URL de acesso
2. Instruções de primeiro acesso
3. Guia rápido de cada funcionalidade
4. Contato do suporte técnico

## Checklist Final

Antes de liberar para usuários:

- [ ] ✅ Todas as migrations aplicadas
- [ ] ✅ Edge Functions deployadas e testadas
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ RLS habilitado em todas as tabelas
- [ ] ✅ Frontend em produção acessível
- [ ] ✅ Autenticação funcionando
- [ ] ✅ Todas as 4 funcionalidades testadas
- [ ] ✅ Logs monitorados
- [ ] ✅ Backups configurados
- [ ] ✅ Documentação de usuário pronta
- [ ] ✅ Limites de custo configurados

## Próximos Passos

Após deploy bem-sucedido:

1. **Treinamento de Usuários** - Sessão de 2h
2. **Período de Piloto** - 30 dias com acompanhamento
3. **Coleta de Feedback** - Ajustes e melhorias
4. **Roll-out Completo** - Liberação para todos

## Suporte

Em caso de dúvidas:
- Email: suporte@assistentegoverno.com.br
- Documentação: https://docs.assistentegoverno.com.br
- Status: https://status.assistentegoverno.com.br

---

**Última atualização:** Janeiro 2025
**Versão:** 1.0.0
