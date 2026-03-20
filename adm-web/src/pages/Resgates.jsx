import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Resgates() {
    const [resgates, setResgates] = useState([]);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);

    async function load() {
        try {
            const res = await api.get("/resgates");
            setResgates(res.data);
        } catch {
            toast.error("Erro ao carregar resgates");
        }
    }

    async function validar(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.get(`/resgates/validar/${token}`);
            toast.success("Resgate validado com sucesso");
            setToken("");
            await load();
        } catch {
            toast.error("Token inválido ou expirado");
        } finally {
            setLoading(false);
        }
    }

    function statusColor(status) {
        if (status === "UTILIZADO") return "text-green-400";
        if (status === "EXPIRADO") return "text-red-400";
        return "text-yellow-400";
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Resgates</h1>

            <form onSubmit={validar} className="mb-6 flex gap-4">
                <input
                    placeholder="Token do QR Code"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="p-2 rounded bg-card flex-1"
                />

                <button
                    disabled={loading}
                    className="bg-primary text-black px-4 rounded"
                >
                    {loading ? "Validando..." : "Validar"}
                </button>
            </form>

            <div className="bg-card p-4 rounded-xl">
                {resgates.length === 0 && (
                    <p className="text-muted">Nenhum resgate encontrado</p>
                )}

                {resgates.map((r) => (
                    <div
                        key={r.id}
                        className="flex justify-between border-b border-muted py-3"
                    >
                        <div>
                            <p className="font-semibold">Token: {r.token}</p>
                            <p className="text-sm text-muted">
                                Expira em: {new Date(r.expira_em).toLocaleString()}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className={`font-semibold ${statusColor(r.status_resgate)}`}>
                                {r.status_resgate}
                            </p>
                            {r.utilizado_em && (
                                <p className="text-sm text-muted">
                                    Usado em: {new Date(r.utilizado_em).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}