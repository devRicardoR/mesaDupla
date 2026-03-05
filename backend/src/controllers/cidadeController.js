import pool from "../config/db.js";

// Criar cidade
export const criarCidade = async (req, res) => {
    try {
        const { nome, estado, logo_url, cor_primaria } = req.body;

        if (!nome || !estado) {
            return res.status(400).json({
                erro: "Nome e estado são obrigatórios."
            });
        }

        const novaCidade = await pool.query(
            `INSERT INTO cidades 
            (nome, estado, logo_url, cor_primaria) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [nome, estado, logo_url || null, cor_primaria || null]
        );

        res.status(201).json(novaCidade.rows[0]);

    } catch (error) {
        console.error("Erro ao criar cidade:", error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};


// Listar cidades
export const listarCidades = async (req, res) => {
    try {
        const cidades = await pool.query(
            `SELECT * FROM cidades ORDER BY id ASC`
        );

        res.json(cidades.rows);

    } catch (error) {
        console.error("Erro ao listar cidades:", error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};


// Buscar cidade por ID
export const buscarCidadePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const cidade = await pool.query(
            `SELECT * FROM cidades WHERE id = $1`,
            [id]
        );

        if (cidade.rows.length === 0) {
            return res.status(404).json({ erro: "Cidade não encontrada" });
        }

        res.json(cidade.rows[0]);

    } catch (error) {
        console.error("Erro ao buscar cidade:", error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};


// Atualizar cidade
export const atualizarCidade = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, estado, logo_url, cor_primaria, ativo } = req.body;

        const cidadeAtualizada = await pool.query(
            `UPDATE cidades SET
                nome = COALESCE($1, nome),
                estado = COALESCE($2, estado),
                logo_url = COALESCE($3, logo_url),
                cor_primaria = COALESCE($4, cor_primaria),
                ativo = COALESCE($5, ativo)
            WHERE id = $6
            RETURNING *`,
            [nome, estado, logo_url, cor_primaria, ativo, id]
        );

        if (cidadeAtualizada.rows.length === 0) {
            return res.status(404).json({ erro: "Cidade não encontrada" });
        }

        res.json(cidadeAtualizada.rows[0]);

    } catch (error) {
        console.error("Erro ao atualizar cidade:", error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};


// Deletar cidade
export const deletarCidade = async (req, res) => {
    try {
        const { id } = req.params;

        const cidadeDeletada = await pool.query(
            `DELETE FROM cidades WHERE id = $1 RETURNING *`,
            [id]
        );

        if (cidadeDeletada.rows.length === 0) {
            return res.status(404).json({ erro: "Cidade não encontrada" });
        }

        res.json({ mensagem: "Cidade deletada com sucesso" });

    } catch (error) {
        console.error("Erro ao deletar cidade:", error);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
};