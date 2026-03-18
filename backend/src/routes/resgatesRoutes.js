import express from "express"
import {
    criarResgate,
    listarResgates,
    buscarResgate,
    listarResgatesPorRestaurante,
    listarResgatesAtivos,
    validarResgatePorToken
} from "../controllers/resgatesController.js"

const router = express.Router()

router.post("/", criarResgate)
router.get("/", listarResgates)
router.get("/:id", buscarResgate)
router.get("/restaurante/:restaurante_id", listarResgatesPorRestaurante);
router.get("/ativos", listarResgatesAtivos);
router.get("/validar/:token", validarResgatePorToken);

export default router