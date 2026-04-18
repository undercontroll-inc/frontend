# Undercontroll Frontend

Aplicação web do sistema **Undercontroll**, responsável pela interface de atendimento para clientes e administradores da assistência técnica.

Esta documentação foi preparada para que o **Beneficiário** consiga entender e utilizar o sistema.

---

## Documentação

### 1) Visão geral do sistema

O sistema Undercontroll é composto por:

- **Frontend (este repositório)**: React + Vite
- **Backend (Undercontroll Core API)**: Spring Boot + Java 21
- **Serviços auxiliares**: RabbitMQ e, conforme cenário, banco de dados externo

### 2) Perfis de acesso

O frontend trabalha com dois perfis principais:

- **ADMINISTRATOR**
  - Gerencia ordens de serviço
  - Gerencia clientes
  - Gerencia estoque de componentes
  - Publica e edita recados
  - Visualiza calendário e analytics
- **CUSTOMER**
  - Acompanha seus consertos
  - Consulta detalhes da OS
  - Visualiza central de recados
  - Acessa informações de visita técnica

### 3) Principais módulos

- **Autenticação**
  - Login por e-mail/senha
  - Cadastro de cliente
  - Login/cadastro com Google (quando Firebase configurado)
  - Fluxo de nova senha no primeiro acesso
- **Consertos**
  - Listagem, filtro e busca
  - Detalhamento da ordem
  - Exportação de PDF da OS
- **Clientes (admin)**
  - Consulta de clientes
  - Histórico de ordens por cliente
  - Cadastro de novos clientes
- **Estoque (admin)**
  - Cadastro, edição e remoção de componentes
  - Filtros por categoria, marca e fornecedor
- **Recados**
  - Gestão de recados (admin)
  - Consulta de recados (cliente e visitante)
- **Configurações**
  - Alteração de dados de contato/endereço
  - Upload de avatar
  - Tema claro/escuro

### 4) Integrações e variáveis de ambiente (frontend)

Crie um arquivo `.env` na raiz do frontend com base no `.env.example`.

Variáveis principais:

- `VITE_API_URL` (obrigatória para integração com o backend)
  - Exemplo: `http://localhost:8080/v1/api`
- Variáveis Firebase para login Google (opcionais)
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

> Se Firebase não estiver configurado corretamente, o sistema mantém o funcionamento por e-mail/senha.

### 5) Tecnologias do frontend

- React 19
- Vite 7
- React Router
- Axios
- Tailwind CSS
- Firebase Auth (Google)

---

## Manual do Usuário

### 1) Acesso ao sistema

1. Abra o frontend no navegador (por padrão: `http://localhost:5173`)
2. Clique em **Entrar**
3. Informe e-mail e senha, ou use **Continuar com Google** (quando habilitado)
4. No primeiro acesso de usuário criado por administrador, será solicitado cadastro de nova senha

### 2) Funcionalidades para Cliente

#### 2.1 Consertos (`/my-repairs`)

- Consulte suas ordens de serviço
- Filtre por status (Pendente, Em Análise, Concluído, Entregue)
- Pesquise por tipo, marca ou modelo
- Abra a OS para detalhes completos

#### 2.2 Detalhes da OS (`/repairs/:id`)

- Visualize status, datas, garantia, mão de obra e valor total
- Consulte peças usadas e observações técnicas
- Exporte a ordem em PDF

#### 2.3 Central de Recados (`/customer-announcements`)

- Veja recados publicados pela assistência
- Filtre por tipo de recado
- Pesquise por título ou conteúdo

#### 2.4 Visita Técnica (`/visit`)

- Consulte endereço e horário de atendimento da loja
- Use os botões para contato por WhatsApp e telefone

#### 2.5 Configurações (`/settings`)

- Atualize telefone, e-mail e endereço
- Faça upload/remova foto de perfil
- Troque tema claro/escuro

### 3) Funcionalidades para Administrador

#### 3.1 Consertos (`/repairs`)

- Liste ordens de serviço
- Filtre por status e busca por OS/cliente
- Crie nova ordem de serviço
- Abra detalhes da OS para acompanhamento e atualização

#### 3.2 Clientes (`/clients`)

- Pesquise clientes por nome, e-mail ou CPF
- Veja dados cadastrais e histórico de ordens
- Cadastre novos clientes

#### 3.3 Estoque (`/storage`)

- Cadastre componentes e itens
- Edite/exclua itens
- Filtre por categoria, marca e fornecedor

#### 3.4 Recados (`/admin/announcements`)

- Crie recados para clientes/visitantes
- Edite ou exclua recados existentes

#### 3.5 Calendário e Dashboard Analítico

- Acesse visão de agenda e métricas operacionais para acompanhamento gerencial

### 4) Navegação

- Menu lateral com páginas por perfil
- Atalho `Ctrl + S` para recolher/expandir menu lateral
- Logout pelo menu de usuário

---

## Manual de Instalação

### 1) Requisitos

### Frontend

- Node.js 20+
- npm 10+

### Backend (Undercontroll Core API)

- Java 21
- Docker e Docker Compose (para dependências locais, quando necessário)
- Maven Wrapper já incluso no backend (`mvnw` / `mvnw.cmd`)

> Use sempre os comandos a partir da raiz de cada repositório.

### 2) Instalação e execução do Frontend

1. Acesse a pasta do frontend:

```bash
cd frontend
```

2. Instale dependências:

```bash
npm ci
```

3. Crie o `.env` com base no exemplo:

```bash
cp .env.example .env
```

4. Ajuste no `.env` a URL da API:

```env
VITE_API_URL="http://localhost:8080/v1/api"
```

5. Suba o frontend:

```bash
npm run dev
```

6. Acesse:

- `http://localhost:5173`

### Scripts úteis (frontend)

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run json-server
npm run dev:full
```

> `dev:full` sobe Vite + json-server local (mock). O sistema principal utiliza a API do backend em `VITE_API_URL`.

### 3) Instalação e execução do Backend (referência operacional)

Abaixo, os cenários recomendados do **Undercontroll Core API**.

### 3.1 Rodando localmente no perfil `dev`

1. Suba RabbitMQ local (se necessário):

```powershell
docker compose up -d rabbitmq
```

2. Inicie o backend no perfil `dev`:

```powershell
$env:SPRING_PROFILES_ACTIVE="dev"; .\mvnw.cmd spring-boot:run
```

No perfil `dev`:

- Banco H2 em memória
- H2 Console: `http://localhost:8080/h2-console`
- RabbitMQ: `localhost:5672`

### 3.2 Gerar artefato e executar `.jar`

```powershell
.\mvnw.cmd clean package -DskipTests
java -jar target\core-0.0.1-SNAPSHOT.jar
```

Com perfil específico:

```powershell
$env:SPRING_PROFILES_ACTIVE="dev"; java -jar target\core-0.0.1-SNAPSHOT.jar
```

### 3.3 Rodando backend no perfil `prod`

Exemplo básico:

```powershell
$env:SPRING_PROFILES_ACTIVE="prod"
$env:DB_URL="jdbc:postgresql://localhost:5432/undercontroll"
$env:DB_DRIVER="org.postgresql.Driver"
$env:DB_USERNAME="undercontroll"
$env:DB_PASSWORD="sua_senha"
$env:RABBITMQ_HOST="localhost"
$env:RABBITMQ_PORT="5672"
$env:RABBITMQ_USER="rabbitmq"
$env:RABBITMQ_PASSWORD="rabbitmq"
$env:JWT_SECRET="uma_chave_forte_aqui"
.\mvnw.cmd spring-boot:run
```

> O `.env.example` do backend contém a lista completa de variáveis opcionais e recomendadas.

### 3.4 Backend com Docker

Build da imagem:

```powershell
docker build -t undercontroll-core .
```

Execução (com arquivo `.env` na raiz do repositório do backend):

```powershell
docker run --rm -p 8080:8080 --env-file .env undercontroll-core
```

### 3.5 Backend com Docker Compose

Para subir dependências auxiliares (MySQL/RabbitMQ) no backend:

```powershell
docker compose up -d
```

### 4) Ordem recomendada de subida (ambiente local completo)

1. Subir dependências do backend (RabbitMQ e/ou banco, se aplicável)
2. Subir backend em `localhost:8080`
3. Confirmar `VITE_API_URL` no frontend apontando para o backend
4. Subir frontend em `localhost:5173`
5. Acessar e autenticar

### 5) URLs úteis

### Frontend

- Aplicação local: `http://localhost:5173`

### Backend (com API em `localhost:8080`)

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Health check: `http://localhost:8080/actuator/health`
- Métricas Prometheus: `http://localhost:8080/actuator/prometheus`
- Console H2 (`dev`): `http://localhost:8080/h2-console`

---

## Solução de problemas

- **Frontend não inicia (`vite: not found`)**
  - Execute `npm ci` para instalar dependências
- **Erro de conexão com API**
  - Verifique se backend está ativo em `localhost:8080`
  - Verifique `VITE_API_URL` no `.env`
- **Erro 401 / redirecionamento para login**
  - Sessão expirada ou token inválido; faça login novamente
- **Login Google indisponível**
  - Verifique variáveis `VITE_FIREBASE_*`

---

## Observações finais

- Este frontend depende da API do backend Undercontroll Core para operação completa.
- O projeto pode operar parcialmente em cenário de mock com `json-server`, mas o fluxo oficial de negócio é via API principal.
