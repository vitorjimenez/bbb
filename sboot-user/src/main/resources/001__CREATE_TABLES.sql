CREATE TABLE usuario (
    id CHAR(36) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    senha VARCHAR(150) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    status_conta VARCHAR(10) NOT NULL,
    criado_em DATETIME
);

CREATE TABLE participante (
    id CHAR(36) PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao VARCHAR(600) NOT NULL,
    foto_url TEXT,
    criado_em DATETIME
);

CREATE TABLE votos (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NULL REFERENCES usuario(id) ON DELETE SET NULL,
    participant_id CHAR(36) NOT NULL REFERENCES participante(id) ON DELETE CASCADE,
    vote_time TIMESTAMP NOT NULL
);
