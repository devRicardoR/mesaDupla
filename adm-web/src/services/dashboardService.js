import api from "./api";

export async function getDashboard() {
    const usuarios = await api.get("/usuarios");
    const restaurantes = await api.get("/restaurantes");
    const assinaturas = await api.get("/assinaturas");
    const pagamentos = await api.get("/pagamentos");

    return {
        usuarios: usuarios.data.length,
        restaurantes: restaurantes.data.length,
        assinaturas: assinaturas.data.length,
        receita: pagamentos.data
        .filter(p => p.status_pagamento === "APROVADO")
        .reduce((total, p) => total + Number(p.valor), 0),
    };
}