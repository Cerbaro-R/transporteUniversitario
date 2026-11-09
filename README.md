# transporteUniversitario

Sistema de organização, comunicação e monitoramento do transporte universitário intermunicipal.
Requisitos completos em `ATIVIDADE SEMANA ACADÊMICA - ELABORAÇÃO DO PROJETO.pdf`.

## Stack

- **Back-end:** Node.js + Express, Sequelize (ORM)
- **Banco:** PostgreSQL
- **Front-end:** React (Vite) + React Router
- **Arquitetura:** MVC — os *models* e *controllers* ficam no back-end, a *view* é o front React

## Estrutura

```
backend/
  src/
    config/        conexão com o banco
    models/        models do Sequelize (M)
    controllers/   regras de cada recurso (C)
    routes/        mapeamento URL -> controller
    middlewares/   autenticação, permissões etc.
    app.js         configuração do Express
    server.js      sobe a API
frontend/
  src/
    pages/         telas (V)
    components/    componentes reutilizáveis
    routes/        rotas do React Router
    services/      chamadas à API
```

## Como rodar

1. Banco: ter o PostgreSQL instalado localmente e criar o banco:
   ```sql
   CREATE DATABASE transporte_universitario;
   ```
   Em seguida, conectado em `transporte_universitario`, rodar o
   `backend/database/schema.sql` para criar as tabelas. Depois ajustar
   usuário e senha do Postgres no `backend/.env`.
2. Back-end (porta 3333):
   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```
3. Front-end (porta 5173):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Teste: `http://localhost:3333/api/health` deve responder `{"status":"ok","database":"conectado"}`.
