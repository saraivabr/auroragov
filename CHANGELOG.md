# Changelog

Todos os changes notáveis neste projeto serão documentados neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado
- Arquivo `.env.example` com template de variáveis de ambiente
- Configuração ESLint (`.eslintrc.cjs`)
- Configuração Prettier (`.prettierrc`)
- Configuração EditorConfig (`.editorconfig`)
- Arquivo LICENSE (MIT)
- CONTRIBUTING.md - Guia de contribuição
- SECURITY.md - Política de segurança
- CODE_OF_CONDUCT.md - Código de conduta
- CHANGELOG.md - Histórico de mudanças
- Documentação estrutural detalhada (ANALISE_ESTRUTURAL.md)
- Documentação de implementação (IMPLEMENTATION.md)
- Documentação de integração Supabase (SUPABASE_INTEGRATION.md)

### Componentes Implementados
- Dashboard principal com gerenciamento de estado
- Header com badges de segurança
- ModelSelector para alternar entre 4 modelos de IA
- TemplateLibrary com 8 templates governamentais
- ChatInterface com histórico unificado
- AuditTrail com logging em tempo real
- ActionBar com ações rápidas
- DocumentWorkspace com editor split-screen
- ComparisonMode para comparar respostas de múltiplos modelos
- EditalReviewHelper para revisão de editais
- MobileWarning para dispositivos móveis
- OnboardingTour para tour guiado
- KeyboardShortcutsHelp para atalhos de teclado

### Infraestrutura
- Configuração Vite para build otimizado
- Configuração TypeScript
- Configuração Tailwind CSS com design system customizado
- Integração shadcn/ui para componentes acessíveis
- Estrutura de diretórios organizada
- Migrações Supabase básicas

## [0.0.0] - 2026-01-06

### Adicionado
- Setup inicial do projeto
- Estrutura base de componentes
- Design system com paleta de cores governamental
- Sistema de tipos TypeScript
- Configuração de roteamento
- Componentes UI base do shadcn/ui

---

**Legenda:**
- `Added` (Adicionado) - para novas funcionalidades
- `Changed` (Modificado) - para mudanças em funcionalidades existentes
- `Deprecated` (Depreciado) - para funcionalidades que serão removidas
- `Removed` (Removido) - para funcionalidades removidas
- `Fixed` (Corrigido) - para correções de bugs
- `Security` (Segurança) - para correções de vulnerabilidades
