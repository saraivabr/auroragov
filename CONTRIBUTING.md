# Como Contribuir para o Aurora Gov

Obrigado por considerar contribuir para o Aurora Gov! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Código de Conduta

Este projeto adere a um Código de Conduta. Ao participar, espera-se que você o respeite. Por favor, leia [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## 🚀 Como Posso Contribuir?

### Reportando Bugs

Antes de criar um relatório de bug:
- Verifique se o bug já não foi reportado nas [Issues](https://github.com/saraivabr/auroragov/issues)
- Use a versão mais recente do código
- Colete informações sobre o bug (navegador, sistema operacional, etapas para reproduzir)

**Como reportar um bug:**
1. Use um título claro e descritivo
2. Descreva as etapas exatas para reproduzir o problema
3. Forneça exemplos específicos
4. Descreva o comportamento observado e esperado
5. Inclua screenshots se aplicável
6. Mencione o navegador, versão e sistema operacional

### Sugerindo Melhorias

**Como sugerir melhorias:**
1. Use um título claro e descritivo
2. Forneça uma descrição detalhada da melhoria sugerida
3. Explique por que essa melhoria seria útil
4. Liste alguns exemplos de uso, se possível

### Pull Requests

**Processo:**
1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit das suas mudanças (`git commit -m 'Add: Amazing Feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

**Diretrizes para Pull Requests:**
- Siga o estilo de código do projeto
- Escreva testes para novas funcionalidades
- Atualize a documentação quando necessário
- Mantenha os commits organizados e com mensagens claras
- Certifique-se de que todos os testes passam
- Certifique-se de que o linter não aponta erros

## 🎨 Padrões de Código

### TypeScript
- Use TypeScript para todo código novo
- Defina tipos explícitos ao invés de `any` quando possível
- Use interfaces para objetos complexos
- Documente funções públicas com JSDoc

### React
- Use functional components com hooks
- Siga as convenções de nomenclatura do React
- Mantenha componentes pequenos e focados
- Extraia lógica complexa para hooks customizados

### Estilos
- Use Tailwind CSS para estilização
- Siga o design system existente
- Mantenha classes organizadas e legíveis
- Use componentes do shadcn/ui quando apropriado

### Commits
Siga a convenção de commits semânticos:
```
Add: Nova funcionalidade
Fix: Correção de bug
Update: Atualização de funcionalidade existente
Remove: Remoção de código/feature
Refactor: Refatoração de código
Docs: Mudanças na documentação
Style: Formatação, lint
Test: Adição ou correção de testes
Chore: Tarefas de manutenção
```

## 🧪 Testes

- Escreva testes para novas funcionalidades
- Certifique-se de que todos os testes passam antes de submeter PR
- Mantenha coverage acima de 70%
- Use nomes descritivos para testes

```bash
# Rodar testes
npm test

# Rodar testes em watch mode
npm test -- --watch

# Ver coverage
npm run test:coverage
```

## 📝 Documentação

- Atualize README.md se adicionar novas features
- Documente funções complexas com comentários
- Atualize CHANGELOG.md com suas mudanças
- Mantenha exemplos de código atualizados

## 🔒 Segurança

Se você descobrir uma vulnerabilidade de segurança, **NÃO** abra uma issue pública. 
Por favor, envie um email para [seguranca@auroragov.br] descrevendo o problema.

## 📦 Estrutura de Branches

- `main` - Código em produção
- `develop` - Código em desenvolvimento
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções de bugs
- `hotfix/*` - Correções urgentes para produção

## ✅ Checklist para Pull Requests

- [ ] O código segue o estilo do projeto
- [ ] Realizei uma auto-revisão do meu código
- [ ] Comentei código em áreas complexas
- [ ] Fiz mudanças correspondentes na documentação
- [ ] Minhas mudanças não geram novos warnings
- [ ] Adicionei testes que provam que minha correção/feature funciona
- [ ] Testes unitários novos e existentes passam localmente
- [ ] Mudanças dependentes foram merged e publicadas
- [ ] Atualizei o CHANGELOG.md

## 💬 Dúvidas?

Sinta-se à vontade para abrir uma [Discussion](https://github.com/saraivabr/auroragov/discussions) ou entrar em contato com a equipe.

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT License).

---

**Obrigado por contribuir com o Aurora Gov! 🚀**
