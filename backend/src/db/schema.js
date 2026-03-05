import pool from "../config/db.js";

const createSchema = async () => {
    try {
        // ────────── TIPOS ENUM ──────────
        await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_usuario') THEN
                CREATE TYPE tipo_usuario AS ENUM ('ADMIN','RESTAURANTE','CLIENTE');
            END IF;
        END$$;`);

        await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_assinatura') THEN
                CREATE TYPE status_assinatura AS ENUM ('PENDENTE','ATIVA','EXPIRADA','CANCELADA');
            END IF;
        END$$;`);

        await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_pagamento') THEN
                CREATE TYPE status_pagamento AS ENUM ('PENDENTE','APROVADO','FALHOU','REEMBOLSADO');
            END IF;
        END$$;`);

        await pool.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_resgate') THEN
                CREATE TYPE status_resgate AS ENUM ('GERADO','UTILIZADO','EXPIRADO');
            END IF;
        END$$;`);

        // ────────── TABELAS ──────────
        await pool.query(`
        CREATE TABLE IF NOT EXISTS cidades (
            id SERIAL PRIMARY KEY,
            nome VARCHAR(150) NOT NULL,
            estado VARCHAR(100) NOT NULL,
            logo_url TEXT,
            cor_primaria VARCHAR(20),
            ativo BOOLEAN DEFAULT TRUE,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            cidade_id INTEGER REFERENCES cidades(id) ON DELETE CASCADE,
            nome VARCHAR(150) NOT NULL,
            email VARCHAR(150) NOT NULL,
            senha TEXT NOT NULL,
            tipo tipo_usuario NOT NULL,
            ativo BOOLEAN DEFAULT TRUE,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (email, cidade_id)
        );`);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS planos (
            id SERIAL PRIMARY KEY,
            cidade_id INTEGER REFERENCES cidades(id) ON DELETE CASCADE,
            nome VARCHAR(100) NOT NULL,
            valor DECIMAL(10,2) NOT NULL,
            duracao_dias INTEGER NOT NULL,
            ativo BOOLEAN DEFAULT TRUE,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS assinaturas (
            id SERIAL PRIMARY KEY,
            cidade_id INTEGER REFERENCES cidades(id) ON DELETE CASCADE,
            usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
            plano_id INTEGER REFERENCES planos(id),
            status status_assinatura DEFAULT 'PENDENTE',
            data_inicio TIMESTAMP,
            data_fim TIMESTAMP,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS pagamentos (
            id SERIAL PRIMARY KEY,
            cidade_id INTEGER REFERENCES cidades(id) ON DELETE CASCADE,
            usuario_id INTEGER REFERENCES usuarios(id),
            assinatura_id INTEGER REFERENCES assinaturas(id),
            gateway VARCHAR(50),
            id_pagamento_gateway VARCHAR(150) UNIQUE,
            valor DECIMAL(10,2) NOT NULL,
            status status_pagamento DEFAULT 'PENDENTE',
            pago_em TIMESTAMP,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS restaurantes (
            id SERIAL PRIMARY KEY,
            cidade_id INTEGER REFERENCES cidades(id) ON DELETE CASCADE,
            usuario_id INTEGER REFERENCES usuarios(id),
            nome VARCHAR(150) NOT NULL,
            descricao TEXT,
            endereco TEXT,
            latitude DECIMAL(10,8),
            longitude DECIMAL(11,8),
            ativo BOOLEAN DEFAULT TRUE,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS pratos (
            id SERIAL PRIMARY KEY,
            cidade_id INTEGER REFERENCES cidades(id) ON DELETE CASCADE,
            restaurante_id INTEGER REFERENCES restaurantes(id) ON DELETE CASCADE,
            nome VARCHAR(150) NOT NULL,
            descricao TEXT,
            regras TEXT,
            ativo BOOLEAN DEFAULT TRUE,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS resgates (
            id SERIAL PRIMARY KEY,
            cidade_id INTEGER REFERENCES cidades(id) ON DELETE CASCADE,
            usuario_id INTEGER REFERENCES usuarios(id),
            restaurante_id INTEGER REFERENCES restaurantes(id),
            prato_id INTEGER REFERENCES pratos(id),
            token VARCHAR(255) UNIQUE NOT NULL,
            status status_resgate DEFAULT 'GERADO',
            expira_em TIMESTAMP NOT NULL,
            utilizado_em TIMESTAMP,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        // ────────── ÍNDICES ──────────

        await pool.query(`CREATE INDEX IF NOT EXISTS idx_usuarios_cidade ON usuarios(cidade_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_assinaturas_usuario ON assinaturas(usuario_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_pagamentos_assinatura ON pagamentos(assinatura_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_resgates_token ON resgates(token);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_resgates_usuario ON resgates(usuario_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_resgates_status ON resgates(status);`);

        await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS unique_assinatura_ativa
        ON assinaturas(usuario_id)
        WHERE status = 'ATIVA';
        `);

        console.log("Schema conferido/criado com sucesso!");
    } catch (err) {
        console.error("Erro ao criar schema automaticamente:", err);
        throw err;
    }
};

export default createSchema;