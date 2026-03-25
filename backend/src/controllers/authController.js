import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios" });
        }

        const usuario = await pool.query(
            "SELECT * FROM usuarios WHERE email = $1",
            [email]
        );

        if (usuario.rows.length === 0) {
            return res.status(401).json({ erro: "Usuário não encontrado" });
        }

        const user = usuario.rows[0];

        const senhaValida = await bcrypt.compare(senha, user.senha);

        if (!senhaValida) {
            return res.status(401).json({ erro: "Senha inválida" });
        }


        const token = jwt.sign(
            {
                id: user.id,
                tipo_usuario: user.tipo,
                cidade_id: user.cidade_id
            },
            "segredo", // depois colocar .env
            { expiresIn: "1d" }
        );

        return res.json({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo_usuario: user.tipo,
                cidade_id: user.cidade_id
            }
        });

    } catch (erro) {
        console.error("Erro no login:", erro);
        return res.status(500).json({ erro: "Erro interno do servidor" });
    }
};