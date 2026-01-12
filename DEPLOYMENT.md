# Guia de Deployment - Aurora Gov

Este guia fornece instruções para fazer deploy do Aurora Gov em diferentes ambientes.

## 📋 Pré-requisitos

- Node.js 20+ instalado
- npm ou yarn
- Git
- Docker (opcional, mas recomendado)
- Conta Supabase configurada
- Chaves de API dos provedores de IA

## 🚀 Deploy Local (Desenvolvimento)

### 1. Clonar o Repositório

```bash
git clone https://github.com/saraivabr/auroragov.git
cd auroragov
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 4. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🐳 Deploy com Docker

### 1. Build da Imagem

```bash
docker build -t auroragov:latest .
```

### 2. Executar Container

```bash
docker run -p 3000:80 auroragov:latest
```

### 3. Usar Docker Compose

```bash
docker-compose up -d
```

A aplicação estará disponível em `http://localhost:3000`

## ☁️ Deploy em Produção

### Vercel (Recomendado)

1. **Conectar Repositório:**
   - Acesse [Vercel](https://vercel.com)
   - Importe o repositório GitHub
   - Configure as variáveis de ambiente

2. **Configuração Automática:**
   - Vercel detecta automaticamente Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Variáveis de Ambiente:**
   - Configure no dashboard da Vercel
   - Adicione todas as variáveis do `.env.example`

4. **Deploy:**
   - Cada push em `main` dispara deploy automático

### Netlify

1. **Conectar Repositório:**
   - Acesse [Netlify](https://netlify.com)
   - New site from Git
   - Selecione o repositório

2. **Configurações de Build:**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Variáveis de Ambiente:**
   - Site settings → Build & deploy → Environment
   - Adicione todas as variáveis necessárias

4. **Deploy:**
   - Deploy automático em cada push

### AWS (EC2 + S3 + CloudFront)

#### Opção 1: Hospedagem Estática (S3 + CloudFront)

1. **Build da Aplicação:**
```bash
npm run build
```

2. **Criar Bucket S3:**
```bash
aws s3 mb s3://auroragov-frontend
aws s3 website s3://auroragov-frontend --index-document index.html --error-document index.html
```

3. **Upload dos Arquivos:**
```bash
aws s3 sync dist/ s3://auroragov-frontend
```

4. **Configurar CloudFront:**
   - Criar distribuição apontando para o bucket S3
   - Configurar certificado SSL
   - Configurar custom error responses para SPA routing

#### Opção 2: EC2 com Nginx

1. **Provisionar EC2 Instance:**
   - Ubuntu 22.04 LTS
   - t3.micro ou maior
   - Security Group: portas 80, 443, 22

2. **Instalar Dependências:**
```bash
sudo apt update
sudo apt install -y nginx nodejs npm git
```

3. **Clonar e Build:**
```bash
git clone https://github.com/saraivabr/auroragov.git
cd auroragov
npm install
npm run build
```

4. **Configurar Nginx:**
```bash
sudo cp nginx.conf /etc/nginx/sites-available/auroragov
sudo ln -s /etc/nginx/sites-available/auroragov /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **Configurar SSL (Certbot):**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d auroragov.gov.br
```

### Google Cloud Platform (Cloud Run)

1. **Criar Projeto GCP:**
```bash
gcloud projects create auroragov-prod
gcloud config set project auroragov-prod
```

2. **Build e Push da Imagem:**
```bash
gcloud builds submit --tag gcr.io/auroragov-prod/auroragov
```

3. **Deploy no Cloud Run:**
```bash
gcloud run deploy auroragov \
  --image gcr.io/auroragov-prod/auroragov \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure (App Service)

1. **Criar Resource Group:**
```bash
az group create --name auroragov-rg --location eastus
```

2. **Criar App Service Plan:**
```bash
az appservice plan create \
  --name auroragov-plan \
  --resource-group auroragov-rg \
  --sku B1 \
  --is-linux
```

3. **Deploy:**
```bash
az webapp up \
  --name auroragov \
  --resource-group auroragov-rg \
  --plan auroragov-plan
```

## 🔐 Configurações de Segurança para Produção

### 1. HTTPS

**Sempre** use HTTPS em produção. Configure certificado SSL:

- **Let's Encrypt (Gratuito):** Certbot
- **Cloudflare:** SSL automático
- **AWS:** ACM (AWS Certificate Manager)

### 2. Variáveis de Ambiente

Nunca faça commit de:
- Chaves de API
- Tokens de autenticação
- Credenciais de banco de dados

Use secrets management:
- **Vercel/Netlify:** Environment variables no dashboard
- **AWS:** Secrets Manager ou Parameter Store
- **GCP:** Secret Manager
- **Azure:** Key Vault

### 3. Content Security Policy (CSP)

Adicione no `index.html` ou configure no servidor:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

### 4. Rate Limiting

Configure rate limiting no nível do servidor ou CDN:
- **Nginx:** `limit_req_zone`
- **CloudFlare:** Rate limiting rules
- **Vercel:** Edge Config

## 📊 Monitoramento

### Logs

**Estrutura de Logs:**
```bash
/var/log/auroragov/
├── access.log
├── error.log
├── application.log
└── audit.log
```

**Ferramentas Recomendadas:**
- **Sentry:** Error tracking
- **LogRocket:** Session replay
- **DataDog:** APM completo
- **New Relic:** Performance monitoring

### Métricas

**Métricas Essenciais:**
- Tempo de resposta (< 200ms)
- Taxa de erro (< 1%)
- Uptime (> 99.9%)
- Usage de APIs de IA (custo)

### Alertas

Configure alertas para:
- Downtime
- Erros críticos
- Uso excessivo de APIs
- Tentativas de acesso não autorizado

## 🔄 CI/CD

O projeto já possui GitHub Actions configurado em `.github/workflows/ci.yml`

### Pipeline Automático

1. **On Push to main/develop:**
   - Lint code
   - Run tests
   - Build application
   - Security audit

2. **Deploy:**
   - Staging: automatic on push to `develop`
   - Production: automatic on push to `main`

### Customizar Deploy Automático

#### Vercel

Adicione ao repositório:
```json
{
  "github": {
    "enabled": true,
    "autoAlias": true
  }
}
```

#### Netlify

Configure `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[context.production]
  environment = { NODE_ENV = "production" }

[context.deploy-preview]
  command = "npm run build"
```

## 🔧 Troubleshooting

### Build Falha

1. Limpar cache:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Verificar versão do Node:
```bash
node --version  # Deve ser 20+
```

### Variáveis de Ambiente Não Carregam

1. Verificar prefixo `VITE_`:
```bash
# ✅ Correto
VITE_API_KEY=xxx

# ❌ Incorreto
API_KEY=xxx
```

2. Rebuild após mudanças:
```bash
npm run build
```

### Rotas 404 em Produção

Configure fallback para `index.html` no servidor:

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Vercel:** Adicionar `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

## 📞 Suporte

- **Documentação:** [README.md](./README.md)
- **Issues:** [GitHub Issues](https://github.com/saraivabr/auroragov/issues)
- **Email:** suporte@auroragov.br

---

**Última Atualização:** 06 de Janeiro de 2026
