# Estrutura de Testes - Aurora Gov

## 📋 Visão Geral

Este documento descreve a estrutura e convenções de testes do projeto Aurora Gov.

## 🧪 Stack de Testes

- **Framework:** Vitest
- **Testing Library:** @testing-library/react
- **Mocking:** Vitest built-in mocks
- **Coverage:** v8

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   └── dashboard/
│       ├── Header.tsx
│       └── ...
└── test/
    ├── setup.ts              # Configuração global de testes
    ├── Header.test.tsx       # Testes do componente Header
    └── ...
```

## 🎯 Convenções de Nomenclatura

- Arquivos de teste: `*.test.tsx` ou `*.test.ts`
- Localização: Dentro de `src/test/` ou ao lado do componente
- Nome descritivo: `ComponentName.test.tsx`

## ✅ Categorias de Testes

### 1. Testes Unitários

Testam componentes isoladamente.

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### 2. Testes de Integração

Testam interação entre múltiplos componentes.

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../components/dashboard/Dashboard';

describe('Dashboard Integration', () => {
  it('should update chat when sending message', () => {
    render(<Dashboard />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /enviar/i });
    
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(button);
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
});
```

### 3. Testes de Hooks

Testam hooks customizados.

```typescript
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '../hooks/useMyHook';

describe('useMyHook', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe(0);
  });

  it('should increment value', () => {
    const { result } = renderHook(() => useMyHook());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.value).toBe(1);
  });
});
```

## 🔧 Comandos

```bash
# Executar todos os testes
npm test

# Executar testes em watch mode
npm test -- --watch

# Executar testes com UI
npm run test:ui

# Gerar relatório de coverage
npm run test:coverage

# Executar testes específicos
npm test Header.test

# Executar testes de um diretório
npm test src/test/components
```

## 📊 Coverage

Meta de coverage:
- **Statements:** 70%
- **Branches:** 65%
- **Functions:** 70%
- **Lines:** 70%

Arquivos excluídos do coverage:
- `node_modules/`
- `src/test/`
- `**/*.d.ts`
- `**/*.config.*`
- `**/mockData`
- `src/stories/`

## 🎭 Mocking

### Mocking de Módulos

```typescript
import { vi } from 'vitest';

// Mock de módulo completo
vi.mock('../utils/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mocked' }))
}));
```

### Mocking de Funções

```typescript
import { vi } from 'vitest';

const mockCallback = vi.fn();

// Verificar chamadas
expect(mockCallback).toHaveBeenCalledTimes(1);
expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2');
```

### Mocking de Props

```typescript
const mockProps = {
  onClose: vi.fn(),
  isOpen: true,
  title: 'Test Modal'
};

render(<Modal {...mockProps} />);
```

## 🧩 Testando Componentes Comuns

### Componentes com Router

```typescript
import { BrowserRouter } from 'react-router-dom';

render(
  <BrowserRouter>
    <MyComponent />
  </BrowserRouter>
);
```

### Componentes com Context

```typescript
import { MyContext } from '../contexts/MyContext';

const mockContextValue = {
  user: { name: 'Test User' },
  login: vi.fn()
};

render(
  <MyContext.Provider value={mockContextValue}>
    <MyComponent />
  </MyContext.Provider>
);
```

### Componentes Assíncronos

```typescript
import { waitFor } from '@testing-library/react';

it('should load data', async () => {
  render(<AsyncComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### Eventos de Usuário

```typescript
import { fireEvent } from '@testing-library/react';
// ou
import userEvent from '@testing-library/user-event';

// fireEvent (síncrono)
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'new value' } });

// userEvent (mais realista, assíncrono)
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'new value');
```

## 📝 Boas Práticas

### 1. Teste Comportamento, Não Implementação

❌ **Evite:**
```typescript
expect(component.state.count).toBe(1);
```

✅ **Prefira:**
```typescript
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

### 2. Use Queries Acessíveis

Ordem de preferência:
1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (último recurso)

### 3. Organize com describe/it

```typescript
describe('Component', () => {
  describe('quando carregando', () => {
    it('deve mostrar loading spinner', () => {
      // test
    });
  });

  describe('quando erro', () => {
    it('deve mostrar mensagem de erro', () => {
      // test
    });
  });
});
```

### 4. Setup e Cleanup

```typescript
import { beforeEach, afterEach } from 'vitest';

describe('Component', () => {
  let mockData;

  beforeEach(() => {
    mockData = { id: 1, name: 'Test' };
  });

  afterEach(() => {
    // cleanup
  });

  it('should use mock data', () => {
    // test using mockData
  });
});
```

### 5. Testes Descritivos

❌ **Evite:**
```typescript
it('test 1', () => { });
```

✅ **Prefira:**
```typescript
it('should display error message when API fails', () => { });
```

## 🚨 Debugging

### Screen Debug

```typescript
import { screen } from '@testing-library/react';

render(<MyComponent />);
screen.debug(); // Mostra HTML atual
```

### Queries Disponíveis

```typescript
screen.logTestingPlaygroundURL(); // URL para playground
```

### Pretty Print

```typescript
import { prettyDOM } from '@testing-library/react';

const element = screen.getByRole('button');
console.log(prettyDOM(element));
```

## 📚 Recursos

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/react)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✍️ Checklist para Novos Componentes

- [ ] Testa renderização básica
- [ ] Testa props obrigatórias
- [ ] Testa interações do usuário
- [ ] Testa estados de loading/error
- [ ] Testa acessibilidade básica
- [ ] Coverage > 70%
- [ ] Sem warnings no console

---

**Última Atualização:** 06 de Janeiro de 2026
