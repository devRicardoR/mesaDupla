import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Plans() {
    const [plans, setPlans] = useState([]);
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [duracao, setDuracao] = useState("");
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    async function load() {
        try {
            const res = await api.get("/planos");
            setPlans(res.data);
        } catch {
            toast.error("Erro ao carregar planos");
        }
    }

    async function createOrUpdate(e) {
        e.preventDefault();
        setLoading(true);

        try {
            if (editing) {
                await api.put(`/planos/${editing.id}`, {
                    nome,
                    preco,
                    duracao_dias: duracao,
                });
                toast.success("Plano atualizado");
            } else {
                await api.post("/planos", {
                    nome,
                    preco,
                    duracao_dias: duracao,
                    cidade_id: user.cidade_id,
                });
                toast.success("Plano criado");
            }

            reset();
            await load();
        } catch {
            toast.error("Erro ao salvar plano");
        } finally {
            setLoading(false);
        }
    }

    async function remove(id) {
        const confirmDelete = window.confirm("Deseja deletar?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/planos/${id}`);
            toast.success("Plano deletado");
            await load();
        } catch {
            toast.error("Erro ao deletar");
        }
    }

    function startEdit(plan) {
        setEditing(plan);
        setNome(plan.nome);
        setPreco(plan.preco);
        setDuracao(plan.duracao_dias);
    }

    function reset() {
        setNome("");
        setPreco("");
        setDuracao("");
        setEditing(null);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Planos</h1>

            <form onSubmit={createOrUpdate} className="mb-6 grid grid-cols-3 gap-4">
                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <input
                    type="number"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <input
                    type="number"
                    placeholder="Duração (dias)"
                    value={duracao}
                    onChange={(e) => setDuracao(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <button
                    disabled={loading}
                    className="col-span-3 bg-primary text-black py-2 rounded disabled:opacity-50"
                >
                    {loading
                        ? "Salvando..."
                        : editing
                        ? "Atualizar Plano"
                        : "Criar Plano"}
                </button>

                {editing && (
                    <button
                        type="button"
                        onClick={reset}
                        className="col-span-3 bg-muted py-2 rounded"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <div className="bg-card p-4 rounded-xl">
                {plans.length === 0 && (
                    <p className="text-muted">Nenhum plano encontrado</p>
                )}

                {plans.map((p) => (
                    <div
                        key={p.id}
                        className="flex justify-between items-center border-b border-muted py-2"
                    >
                        <div>
                            <p className="font-semibold">{p.nome}</p>
                            <p className="text-sm text-muted">
                                R$ {p.preco} • {p.duracao_dias} dias
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => startEdit(p)}
                                className="text-blue-400"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => remove(p.id)}
                                className="text-danger"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}