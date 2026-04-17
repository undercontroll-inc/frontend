# Frontend - Comercial Irmãos Pelluci

Aplicação frontend desenvolvida com React + Vite para gerenciamento de assistência técnica de eletrodomésticos, com áreas para clientes e administradores.

## Sumário

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração de ambiente](#configuração-de-ambiente)
- [Como executar](#como-executar)
- [Scripts disponíveis](#scripts-disponíveis)
- [Como usar a aplicação](#como-usar-a-aplicação)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Integração com backend](#integração-com-backend)
- [Build e deploy](#build-e-deploy)
- [Solução de problemas](#solução-de-problemas)

## Tecnologias

- React 19
- Vite 7
- React Router DOM 7
- Tailwind CSS 4
- Axios
- Firebase Auth (Google OAuth)

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- Node.js (recomendado: versão LTS)
- npm (vem com o Node.js)
- (Opcional) Git

Verifique as versões:

```bash
node -v
npm -v
```

## Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
```

2. Acesse a pasta do frontend:

```bash
cd frontend
```

3. Instale as dependências:

```bash
npm install
```

## Configuração de ambiente

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

No Windows (PowerShell), você pode usar:

```powershell
Copy-Item .env.example .env
```

2. Configure as variáveis no `.env`:

```env
# URL da API backend
VITE_API_URL="http://localhost:8080/v1/api"

# Firebase (Google OAuth)
VITE_FIREBASE_API_KEY="SUA_CHAVE"
VITE_FIREBASE_AUTH_DOMAIN="SEU_DOMINIO"
VITE_FIREBASE_PROJECT_ID="SEU_PROJETO"
VITE_FIREBASE_STORAGE_BUCKET="SEU_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="SEU_SENDER_ID"
VITE_FIREBASE_APP_ID="SEU_APP_ID"
```

## Como executar

### Modo desenvolvimento (frontend)

```bash
npm run dev
```

A aplicação ficará disponível em:

- `http://localhost:5173`

### Modo desenvolvimento completo (frontend + json-server)

```bash
npm run dev:full
```

Esse comando executa:

- frontend (Vite) em `5173`
- json-server em `3000`

## Scripts disponíveis

- `npm run dev` - inicia o frontend em modo desenvolvimento
- `npm run build` - gera build de produção
- `npm run preview` - sobe localmente a build de produção
- `npm run lint` - roda o ESLint
- `npm run json-server` - inicia json-server com `db.json` na porta `3000`
- `npm run dev:full` - roda `json-server` + `dev` simultaneamente

## Como usar a aplicação

### Fluxo público

- Página inicial (landing): `/`
- Central de recados pública: `/announcements`
- Login: `/login`
- Cadastro: `/register`
- Nova senha: `/nova-senha`

### Fluxo autenticado (cliente)

Após login como cliente, o usuário pode acessar recursos como:

- acompanhamento de consertos
- detalhes de ordens
- visitas/orçamentos
- recados para cliente

### Fluxo autenticado (administrador)

Usuários administradores possuem acesso a páginas de gestão, como:

- dashboard e analytics
- ordens de reparo
- clientes
- anúncios administrativos
- calendário
- estoque
- configurações

## Estrutura de pastas

```txt
src/
  assets/          # imagens e arquivos estáticos
  components/      # componentes por domínio (auth, admin, customer, etc.)
  config/          # configurações (ex.: firebase)
  contexts/        # contextos globais (auth, toast)
  providers/       # clients HTTP (api, json-server, via-cep)
  services/        # camada de serviços e integração com API
  utils/           # utilitários gerais
  App.jsx          # roteamento principal
  main.jsx         # entrada da aplicação
```

## Integração com backend

A aplicação usa `VITE_API_URL` como base da API.

- Padrão local esperado: `http://localhost:8080/v1/api`
- O frontend envia token JWT no header `Authorization` quando autenticado.
- Em respostas `401`, o usuário é redirecionado para login automaticamente.

### Observação sobre json-server

O `json-server` é útil para testes e dados locais (`db.json`), mas não substitui completamente a API principal. Para uso completo do sistema, mantenha o backend real em execução.

## Build e deploy

Gerar build:

```bash
npm run build
```

Pré-visualizar build local:

```bash
npm run preview
```

Arquivos finais serão gerados em `dist/`.

## Solução de problemas

### 1) Erro de conexão com API

- Verifique se o backend está rodando.
- Confirme se `VITE_API_URL` está correto no `.env`.

### 2) Login com Google não funciona

- Confira as variáveis `VITE_FIREBASE_*`.
- Verifique se o OAuth do Google está configurado no projeto Firebase.

### 3) Porta em uso

Se `5173` ou `3000` estiverem ocupadas, finalize processos conflitantes ou configure outra porta.

### 4) Dependências quebradas

Tente reinstalar:

```bash
rm -rf node_modules package-lock.json
npm install
```

No Windows, remova a pasta `node_modules` manualmente ou com PowerShell.

---

## Boas práticas para contribuição

1. Crie uma branch para sua feature/correção.
2. Faça commits pequenos e descritivos.
3. Rode `npm run lint` antes de abrir PR.
4. Teste os fluxos principais após alterações.

---
