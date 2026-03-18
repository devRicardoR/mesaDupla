import db from "../config/db.js";
import crypto from "crypto";
import QRCode from "qrcode";

// gerar resgate (QR)
export const criarResgate = async (req, res) => {
    try {
        const {
            cidade_id,
            usuario_id,
            restaurante_id,
            prato_id
        } = req.body;

        // verificar assinatura ativa
        const assinatura = await db.query(
            `SELECT * FROM assinaturas
            WHERE usuario_id = $1
            AND status = 'ATIVA'`,
            [usuario_id]
        );

        if (assinatura.rows.length === 0) {
            return res.status(403).json({ erro: "Usuário não possui assinatura ativa" });
        }

        // gerar token
        const token = crypto.randomBytes(16).toString("hex");

        // gerar URL + QR
        const url = `http://localhost:3000/resgates/validar/${token}`;
        const qrCode = await QRCode.toDataURL(url);

        const result = await db.query(
            `INSERT INTO resgates
            (cidade_id, usuario_id, restaurante_id, prato_id, token, expira_em)
            VALUES ($1,$2,$3,$4,$5,NOW() + INTERVAL '10 minutes')
            RETURNING *`,
            [cidade_id, usuario_id, restaurante_id, prato_id, token]
        );

        res.status(201).json({
            ...result.rows[0],
            qr_code: qrCode
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao gerar resgate" });
    }
};


// listar todos os resgates
export const listarResgates = async (req, res) => {
    try {
        const resgates = await db.query(
            "SELECT * FROM resgates ORDER BY id"
        );

        const resgatesComQR = await Promise.all(
            resgates.rows.map(async (r) => {
                const url = `http://localhost:3000/resgates/validar/${r.token}`;
                return {
                    ...r,
                    qr_code: await QRCode.toDataURL(url)
                };
            })
        );

        res.json(resgatesComQR);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao listar resgates" });
    }
};


// buscar resgate por ID
export const buscarResgate = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            "SELECT * FROM resgates WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ erro: "Resgate não encontrado" });
        }

        const r = result.rows[0];
        const url = `http://localhost:3000/resgates/validar/${r.token}`;

        res.json({
            ...r,
            qr_code: await QRCode.toDataURL(url)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao buscar resgate" });
    }
};


// validar resgate via QR (URL)
export const validarResgatePorToken = async (req, res) => {
    try {
        const { token } = req.params;

        const resgate = await db.query(
            "SELECT * FROM resgates WHERE token = $1",
            [token]
        );

        if (resgate.rows.length === 0) {
            return res.status(404).json({ erro: "Resgate não encontrado" });
        }

        const r = resgate.rows[0];

        if (r.status === "UTILIZADO") {
            return res.json({ mensagem: "Resgate já utilizado" });
        }

        if (new Date(r.expira_em) < new Date()) {
            return res.json({ mensagem: "Resgate expirado" });
        }

        await db.query(
            `UPDATE resgates
            SET status = 'UTILIZADO',
            utilizado_em = NOW()
            WHERE id = $1`,
            [r.id]
        );

        res.json({ mensagem: "Resgate validado com sucesso" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao validar resgate" });
    }
};


// listar por restaurante
export const listarResgatesPorRestaurante = async (req, res) => {
    try {
        const { restaurante_id } = req.params;

        const resgates = await db.query(
            "SELECT * FROM resgates WHERE restaurante_id = $1 ORDER BY id",
            [restaurante_id]
        );

        const resgatesComQR = await Promise.all(
            resgates.rows.map(async (r) => {
                const url = `http://localhost:3000/resgates/validar/${r.token}`;
                return {
                    ...r,
                    qr_code: await QRCode.toDataURL(url)
                };
            })
        );

        res.json(resgatesComQR);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao listar resgates do restaurante" });
    }
};


// listar apenas ativos
export const listarResgatesAtivos = async (req, res) => {
    try {
        const resgates = await db.query(
            `SELECT * FROM resgates
            WHERE status = 'GERADO'
            AND expira_em > NOW()
            ORDER BY id`
        );

        const resgatesComQR = await Promise.all(
            resgates.rows.map(async (r) => {
                const url = `http://localhost:3000/resgates/validar/${r.token}`;
                return {
                    ...r,
                    qr_code: await QRCode.toDataURL(url)
                };
            })
        );

        res.json(resgatesComQR);

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao listar resgates ativos" });
    }
};