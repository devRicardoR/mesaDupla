import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Payments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);

    async function load() {
        setLoading(true);
        try {
            const res = await api.get("/pagamentos");
            setPayments(res.data);
        } catch {
            toast.error("Erro ao carregar pagamentos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Pagamentos</h1>

            <div className="bg-card p-4 rounded-xl">
                {loading && (
                    <p className="text-muted">Carregando...</p>
                )}

                {!loading && payments.length === 0 && (
                    <p className="text-muted">
                        Nenhum pagamento encontrado
                    </p>
                )}

                {!loading &&
                    payments.map((p) => (
                        <div
                            key={p.id}
                            className="flex justify-between items-center border-b border-muted py-3"
                        >
                            <div>
                                <p className="font-semibold">
                                    Usuário #{p.usuario_id}
                                </p>
                                <p className="text-sm text-muted">
                                    {p.metodo_pagamento}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold">
                                    R$ {p.valor}
                                </p>
                                <p className="text-sm text-muted">
                                    {p.status_pagamento}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}