# transporteUniversitario

Sistema de organização, comunicação e monitoramento do transporte universitário intermunicipal.
Requisitos completos em `ATIVIDADE SEMANA ACADÊMICA - ELABORAÇÃO DO PROJETO.pdf`.

## Stack

- **Back-end:** Node.js + Express, Sequelize (ORM), JWT + bcrypt para login
- **Banco:** PostgreSQL
- **Front-end:** React (Vite) + React Router + Material UI
- **Arquitetura:** MVC — os *models* e *controllers* ficam no back-end, a *view* é o front React

## Estrutura

```
backend/
  database/
    schema.sql     estrutura completa do banco
    alteracoes/    mudanças para quem já criou o banco antes
  scripts/         utilitários (ex.: criar o primeiro organizador)
  src/
    config/        conexão com o banco
    models/        models do Sequelize (M)
    controllers/   regras de cada recurso (C)
    routes/        mapeamento URL -> controller
    middlewares/   autenticar (login) e permitir (perfil)
    utils/         validação, token JWT
    app.js         configuração do Express
    server.js      sobe a API
frontend/
  src/
    pages/         telas (V)
    components/    componentes reutilizáveis (Layout, menu, campos)
    contexts/      AuthProvider (usuário logado)
    hooks/         useAuth()
    routes/        rotas do React Router e proteção por login/perfil
    services/      api.js — chamadas à API (já envia o token)
    utils/         regras de formulário
    theme.js       tema do Material UI (cores, fontes)
```

## Como rodar

1. Banco: ter o PostgreSQL instalado localmente e criar o banco:
   ```sql
   CREATE DATABASE transporte_universitario;
   ```
   Em seguida, conectado em `transporte_universitario`, rodar o
   `backend/database/schema.sql` para criar as tabelas.
   Se você já tinha criado as tabelas antes, rode só os arquivos de
   `backend/database/alteracoes/` que ainda não rodou.
2. Back-end (porta 3333):
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```
   No `.env`, ajuste usuário/senha do Postgres e coloque um valor
   aleatório em `JWT_SECRET`.
3. Front-end (porta 5173):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Criar o primeiro organizador (pela tela só dá para criar alunos):
   ```bash
   cd backend
   npm run criar-organizador -- "Seu Nome" seu@email.com suasenha
   ```
   Depois de logado, um organizador cadastra outros em **Novo organizador**.

Teste: `http://localhost:3333/api/health` deve responder `{"status":"ok","database":"conectado"}`.

## Autenticação — como usar nas outras partes

**API**

| Método | Rota | Quem acessa |
|---|---|---|
| POST | `/api/auth/cadastro` | público (cria **aluno**) |
| POST | `/api/auth/login` | público |
| GET | `/api/auth/eu` | logado |
| POST | `/api/usuarios/organizadores` | organizador |

Login e cadastro devolvem `{ usuario, token }`. As rotas protegidas exigem o
header `Authorization: Bearer <token>`.

**Protegendo uma rota nova no back-end** (`backend/src/routes/index.js`):

```js
routes.get('/passageiros', autenticar, permitir('organizador'), PassageiroController.listar);
routes.post('/checkins', autenticar, permitir('aluno'), CheckinController.criar);
```

`autenticar` responde 401 sem login; `permitir` responde 403 com perfil errado.
Dentro do controller, `req.usuario` tem `{ id, perfil }` de quem está logado.

**No front-end**

- Chamadas à API: `api('/checkins', { method: 'POST', body: dados })` de
  `services/api.js` — o token vai automaticamente.
- Usuário logado: `const { usuario, sair } = useAuth()`.
- Tela nova: crie em `pages/`, adicione a `<Route>` dentro do bloco do Layout em
  `routes/AppRoutes.jsx` (use `<RotaPrivada perfis={['organizador']}>` para
  restringir por perfil) e o item do menu em `components/menu.js`.
