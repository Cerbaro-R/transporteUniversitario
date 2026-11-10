-- Rode só se você criou o banco com uma versão antiga do schema.sql
-- (sem as colunas abaixo). Quem rodar o schema.sql atual já tem tudo.
ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS telefone      VARCHAR(20),
    ADD COLUMN IF NOT EXISTS instituicao   VARCHAR(120),
    ADD COLUMN IF NOT EXISTS curso         VARCHAR(120),
    ADD COLUMN IF NOT EXISTS cidade_origem VARCHAR(120);
