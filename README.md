# Aurora Gov 🚀

> Central Unificada de Comando de IA para o Setor Público Brasileiro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646cff.svg)](https://vitejs.dev/)

## 📋 Sobre o Projeto

O **Aurora Gov** é uma plataforma governamental inovadora que consolida múltiplos modelos de Inteligência Artificial (ChatGPT, Claude, Gemini, DeepSeek) em uma interface unificada, segura e auditável, especificamente projetada para o setor público brasileiro.

### ✨ Características Principais

- 🤖 **4 Modelos de IA Integrados**: ChatGPT, Claude, Gemini e DeepSeek
- 🔒 **Segurança e Conformidade**: LGPD, ISO 27001, criptografia
- 📊 **Trilha de Auditoria Completa**: Registro de todas as interações
- 📝 **Templates Governamentais**: 8+ templates pré-configurados
- 🎨 **Interface Intuitiva**: Design system moderno e acessível
- 🔍 **Modo de Comparação**: Compare respostas de múltiplos modelos
- ✏️ **Workspace de Documentos**: Editor split-screen integrado

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20 ou superior
- npm ou yarn
- Git

### Instalação

```bash
# Clone o repositório
git clone https://github.com/saraivabr/auroragov.git
cd auroragov

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse http://localhost:5173 no seu navegador.

## 📖 Documentação

- [📘 Análise Estrutural Completa](./ANALISE_ESTRUTURAL.md) - Documentação técnica detalhada
- [📗 Guia de Implementação](./IMPLEMENTATION.md) - Sumário de features implementadas
- [📙 Integração Supabase](./SUPABASE_INTEGRATION.md) - Documentação do backend
- [📕 Guia de Deploy](./DEPLOYMENT.md) - Instruções de deployment
- [📔 Guia de Testes](./TESTING.md) - Estrutura e convenções de testes
- [📓 Como Contribuir](./CONTRIBUTING.md) - Guia para contribuidores
- [🔒 Política de Segurança](./SECURITY.md) - Segurança e vulnerabilidades

## 💻 Stack Tecnológico

### Frontend
- **React 18.2** - Framework UI
- **TypeScript 5.8** - Type safety
- **Vite 7.1** - Build tool
- **Tailwind CSS 3.4** - Styling
- **shadcn/ui** - Componentes UI

### Backend (Preparado)
- **Supabase 2.45** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados

### Testes
- **Vitest 1.0** - Test framework
- **Testing Library** - Testes de componentes

## 🎯 Funcionalidades

### Implementadas ✅

- [x] Seletor de modelos de IA (ChatGPT, Claude, Gemini, DeepSeek)
- [x] Interface de chat unificada com histórico
- [x] Trilha de auditoria em tempo real
- [x] Biblioteca de templates governamentais
- [x] Workspace de documentos com editor split-screen
- [x] Modo de comparação entre modelos
- [x] Header com badges de segurança
- [x] Tour de onboarding interativo
- [x] Atalhos de teclado
- [x] Design responsivo (desktop-first)

### Em Desenvolvimento 🚧

- [ ] Autenticação e autorização
- [ ] Integração com APIs de IA reais
- [ ] Persistência de dados no Supabase
- [ ] Criptografia end-to-end
- [ ] Rate limiting
- [ ] Exportação real de documentos
- [ ] Modo offline (PWA)

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build para produção
npm run preview          # Preview do build

# Qualidade de Código
npm run lint             # Executa ESLint
npm run lint:fix         # Corrige problemas do ESLint
npm run format           # Formata código com Prettier
npm run format:check     # Verifica formatação

# Testes
npm test                 # Executa testes
npm run test:ui          # Executa testes com UI
npm run test:coverage    # Gera relatório de coverage

# Supabase
npm run types:supabase   # Gera tipos TypeScript do Supabase
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t auroragov:latest .

# Executar container
docker run -p 3000:80 auroragov:latest

# Docker Compose
docker-compose up -d
```

## 📁 Estrutura do Projeto

```
auroragov/
├── src/
│   ├── components/           # Componentes React
│   │   ├── dashboard/        # Componentes do Dashboard
│   │   ├── ui/              # Componentes UI (shadcn)
│   │   └── auth/            # Componentes de autenticação
│   ├── types/               # Tipos TypeScript
│   ├── data/                # Dados estáticos
│   ├── lib/                 # Utilitários
│   ├── hooks/               # React hooks customizados
│   ├── contexts/            # React contexts
│   ├── test/                # Testes
│   └── main.tsx             # Entry point
├── public/                  # Assets estáticos
├── supabase/               # Configuração Supabase
│   └── migrations/         # Migrações do banco
├── .github/                # GitHub Actions
│   └── workflows/          # CI/CD workflows
└── docs/                   # Documentação adicional
```

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia nosso [Guia de Contribuição](./CONTRIBUTING.md) antes de submeter um PR.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Amazing Feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🔒 Segurança

Se você descobrir uma vulnerabilidade de segurança, por favor, veja nossa [Política de Segurança](./SECURITY.md) para instruções sobre como reportar.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](./LICENSE) para detalhes.

## 👥 Autores

- **Equipe Aurora Gov** - *Desenvolvimento inicial*

## 🙏 Agradecimentos

- shadcn/ui por componentes UI acessíveis
- Radix UI por primitivos de alta qualidade
- Comunidade open source

## 📞 Suporte

- 📧 Email: suporte@auroragov.br
- 🐛 Issues: [GitHub Issues](https://github.com/saraivabr/auroragov/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/saraivabr/auroragov/discussions)

---

**Desenvolvido com ❤️ para o Setor Público Brasileiro**
