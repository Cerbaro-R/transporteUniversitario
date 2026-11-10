-- =====================================================================
-- Transporte Universitário — estrutura base do banco (PostgreSQL)
--
-- 1) Crie o banco (conectado no banco "postgres"):
--      CREATE DATABASE transporte_universitario;
-- 2) Conecte em transporte_universitario e rode este arquivo inteiro.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- Usuários (RF01, RF02): alunos e organizadores
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id          SERIAL PRIMARY KEY,
    nome        VARCHAR(120) NOT NULL,
    email       VARCHAR(160) NOT NULL UNIQUE,
    senha_hash  VARCHAR(255) NOT NULL,
    perfil      VARCHAR(20)  NOT NULL DEFAULT 'aluno'
                CHECK (perfil IN ('aluno', 'organizador')),
    telefone       VARCHAR(20),
    instituicao    VARCHAR(120),
    curso          VARCHAR(120),
    cidade_origem  VARCHAR(120),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Rotas: cada linha de ônibus (ex.: "Xaxim -> UNO Chapecó, noturno")
-- prazo_checkin = horário limite para fazer/alterar check-in (caso 3)
-- ---------------------------------------------------------------------
CREATE TABLE rotas (
    id               SERIAL PRIMARY KEY,
    nome             VARCHAR(120) NOT NULL,
    descricao        TEXT,
    organizador_id   INTEGER NOT NULL REFERENCES usuarios(id),
    horario_saida    TIME NOT NULL,
    horario_retorno  TIME,
    prazo_checkin    TIME NOT NULL,
    ativa            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Pontos de embarque de cada rota, na ordem do trajeto
-- ---------------------------------------------------------------------
CREATE TABLE pontos_embarque (
    id          SERIAL PRIMARY KEY,
    rota_id     INTEGER NOT NULL REFERENCES rotas(id) ON DELETE CASCADE,
    nome        VARCHAR(120) NOT NULL,
    endereco    VARCHAR(255),
    latitude    NUMERIC(9, 6),
    longitude   NUMERIC(9, 6),
    ordem       INTEGER NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (rota_id, ordem)
);

-- ---------------------------------------------------------------------
-- Passageiros cadastrados em cada rota. Quem está aqui e não fez
-- check-in no dia aparece como "Pendente" na lista (RF08, caso 6)
-- ---------------------------------------------------------------------
CREATE TABLE rota_passageiros (
    id                       SERIAL PRIMARY KEY,
    rota_id                  INTEGER NOT NULL REFERENCES rotas(id) ON DELETE CASCADE,
    aluno_id                 INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    ponto_embarque_padrao_id INTEGER REFERENCES pontos_embarque(id) ON DELETE SET NULL,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (rota_id, aluno_id)
);

-- ---------------------------------------------------------------------
-- Viagens: uma rota em um dia específico (base do histórico de viagens)
-- ---------------------------------------------------------------------
CREATE TABLE viagens (
    id          SERIAL PRIMARY KEY,
    rota_id     INTEGER NOT NULL REFERENCES rotas(id) ON DELETE CASCADE,
    data        DATE NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'agendada'
                CHECK (status IN ('agendada', 'em_andamento', 'concluida', 'cancelada')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (rota_id, data)
);

-- ---------------------------------------------------------------------
-- Check-ins (RF06, RF07, casos 2 e 3): um por aluno por viagem.
-- vai = TRUE  -> "Confirmado"; vai = FALSE -> "Não utilizará"
-- ---------------------------------------------------------------------
CREATE TABLE checkins (
    id                 SERIAL PRIMARY KEY,
    viagem_id          INTEGER NOT NULL REFERENCES viagens(id) ON DELETE CASCADE,
    aluno_id           INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    ponto_embarque_id  INTEGER REFERENCES pontos_embarque(id) ON DELETE SET NULL,
    vai                BOOLEAN NOT NULL,
    retorna            BOOLEAN NOT NULL DEFAULT TRUE,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (viagem_id, aluno_id),
    -- quem vai precisa informar o ponto de embarque
    CHECK (vai = FALSE OR ponto_embarque_id IS NOT NULL)
);

-- ---------------------------------------------------------------------
-- Localizações GPS do ônibus durante a viagem (RF04, RF05, caso 4)
-- ---------------------------------------------------------------------
CREATE TABLE localizacoes (
    id            BIGSERIAL PRIMARY KEY,
    viagem_id     INTEGER NOT NULL REFERENCES viagens(id) ON DELETE CASCADE,
    latitude      NUMERIC(9, 6) NOT NULL,
    longitude     NUMERIC(9, 6) NOT NULL,
    velocidade    NUMERIC(5, 2),           -- km/h, ajuda no cálculo da previsão
    registrado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- busca rápida da última posição de uma viagem
CREATE INDEX idx_localizacoes_viagem_data
    ON localizacoes (viagem_id, registrado_em DESC);

-- ---------------------------------------------------------------------
-- Avisos (RF10, RF11, caso 5). rota_id NULL = aviso para todas as rotas
-- ---------------------------------------------------------------------
CREATE TABLE avisos (
    id          SERIAL PRIMARY KEY,
    autor_id    INTEGER NOT NULL REFERENCES usuarios(id),
    rota_id     INTEGER REFERENCES rotas(id) ON DELETE CASCADE,
    mensagem    TEXT NOT NULL CHECK (LENGTH(TRIM(mensagem)) > 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_avisos_rota_data ON avisos (rota_id, created_at DESC);

COMMIT;
