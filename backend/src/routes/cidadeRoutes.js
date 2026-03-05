import express from "express";
import {
    criarCidade,
    listarCidades,
    buscarCidadePorId,
    atualizarCidade,
    deletarCidade
} from "../controllers/cidadeController.js";

const router = express.Router();

router.post("/", criarCidade);
router.get("/", listarCidades);
router.get("/:id", buscarCidadePorId);
router.put("/:id", atualizarCidade);
router.delete("/:id", deletarCidade);

export default router;