# Assistente Governamental IA

Sistema de assistência inteligente para servidores públicos brasileiros, oferecendo consultas jurídicas, análise de documentos e geração automatizada de documentos oficiais.

## Funcionalidades Principais

### 1. Consulta Jurídica
- Consultas sobre legislação brasileira (Leis, Decretos, Portarias)
- Respostas contextualizadas com base legal
- Sistema de feedback para avaliação de qualidade
- Histórico de consultas por usuário

### 2. Análise de Documentos
- Análise automatizada de editais, contratos e normativos
- Identificação de pontos críticos com nível de severidade
- Checklist de conformidade com legislação
- Análise de riscos (operacional, jurídico, financeiro)

### 3. Gerador de Documentos Oficiais
- Geração automática de Ofícios, Memorandos, Pareceres e Despachos
- Melhoria de texto com IA seguindo padrões de redação oficial
- Templates pré-configurados
- Exportação e salvamento de documentos

## Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Navegação entre páginas
- **Tailwind CSS** - Framework de estilização
- **Radix UI** - Componentes acessíveis
- **Shadcn/ui** - Biblioteca de componentes

### Backend & Database
- **Supabase** - Backend as a Service (PostgreSQL)
- **Supabase Edge Functions** - Funções serverless
- **Row Level Security (RLS)** - Segurança de dados

### Inteligência Artificial
- **OpenAI GPT-4o-mini** - Modelo de linguagem (mais econômico)
- Edge Functions para segurança da chave API

## Estrutura do Projeto

```
├── src/
│   ├── pages/                    # Páginas da aplicação
│   │   ├── HomePage.tsx
│   │   ├── ConsultaJuridicaPage.tsx
│   │   ├── AnaliseDocumentosPage.tsx
│   │   ├── GeradorDocumentosPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── components/               # Componentes reutilizáveis
│   │   ├── auth/                # Componentes de autenticação
│   │   ├── dashboard/           # Componentes do dashboard
│   │   ├── layout/              # Layout e navegação
│   │   └── ui/                  # Componentes UI (shadcn)
│   ├── contexts/                # Contextos React
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utilitários e configurações
│   │   ├── supabase.ts         # Cliente Supabase
│   │   └── utils.ts
│   └── types/                   # Tipos TypeScript
│       ├── database.ts
│       └── supabase.ts
├── supabase/
│   ├── functions/               # Edge Functions
│   │   ├── consulta-juridica/
│   │   ├── analise-documentos/
│   │   └── gerador-documentos/
│   └── migrations/              # Migrações do banco
└── public/                      # Arquivos estáticos
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
SUPABASE_PROJECT_ID=id_do_projeto

# OpenAI (usada nas Edge Functions)
OPENAI_API_KEY=sua_chave_openai
VITE_OPENAI_MODEL=gpt-4o-mini
```

## Instalação e Configuração

### Pré-requisitos
- Node.js 18+ e npm
- Conta Supabase (gratuita)
- Conta OpenAI com chave API

### Passo a Passo

1. **Clone o repositório**
```bash
git clone <repo-url>
cd assistente-governamental
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
- Copie `.env.example` para `.env`
- Preencha com suas credenciais do Supabase e OpenAI

4. **Execute as migrações do banco de dados**
```bash
npx supabase migration up
```

5. **Execute o projeto em modo desenvolvimento**
```bash
npm run dev
```

6. **Acesse a aplicação**
```
http://localhost:5173
```

## Deploy

### Build de Produção
```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Deploy em Vercel/Netlify

1. Configure as variáveis de ambiente no painel do serviço
2. Conecte o repositório Git
3. O deploy será automático a cada push na branch principal

## Banco de Dados

### Principais Tabelas

- **consultas_juridicas** - Histórico de consultas jurídicas
- **analises_documentos** - Análises de documentos realizadas
- **documentos_oficiais** - Documentos gerados pelo sistema
- **base_normativa** - Leis, decretos e normas cadastradas
- **processos_administrativos** - Gerenciamento de processos
- **solicitacoes_cidadao** - Solicitações de cidadãos
- **recursos_administrativos** - Recursos e impugnações

### Segurança (RLS)

Todas as tabelas possuem Row Level Security (RLS) habilitado, garantindo que:
- Usuários só acessam seus próprios dados
- Autenticação é obrigatória para todas as operações
- Políticas específicas por tipo de operação (SELECT, INSERT, UPDATE, DELETE)

## Edge Functions

### consulta-juridica
- **Rota**: `/functions/v1/consulta-juridica`
- **Método**: POST
- **Payload**: `{ pergunta: string, userId: string }`
- **Resposta**: Análise jurídica com base legal

### analise-documentos
- **Rota**: `/functions/v1/analise-documentos`
- **Método**: POST
- **Payload**: `{ tipoDocumento: string, titulo: string, conteudo: string, userId: string }`
- **Resposta**: Análise estruturada do documento

### gerador-documentos
- **Rota**: `/functions/v1/gerador-documentos`
- **Método**: POST
- **Payload**: `{ tipoDocumento: string, conteudo: string, contexto?: string, userId: string }`
- **Resposta**: Texto melhorado seguindo padrões oficiais

## Custos Estimados

### OpenAI (GPT-4o-mini)
- Consulta jurídica: ~$0.002 por consulta
- Análise de documento: ~$0.004 por análise
- Melhoria de texto: ~$0.001 por geração

**Estimativa mensal** (uso moderado): $20-50 USD

### Supabase
- Plano gratuito: até 500MB de banco de dados e 2GB de armazenamento
- Plano Pro ($25/mês): recomendado para produção

## Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Cria build de produção
npm run preview      # Preview do build de produção
npm run lint         # Executa linter
npm run types:supabase  # Gera tipos TypeScript do banco
```

## Autenticação

O sistema utiliza autenticação nativa do Supabase com:
- Email/senha
- Recuperação de senha por email
- Sessões gerenciadas automaticamente
- Proteção de rotas privadas

## Suporte e Contribuições

Para reportar bugs ou sugerir melhorias, abra uma issue no repositório.

## Licença

Este projeto está sob a licença MIT.

## Avisos Legais

As informações fornecidas pela IA têm caráter orientativo e não substituem pareceres jurídicos oficiais. Sempre consulte a assessoria jurídica do órgão para casos específicos.
