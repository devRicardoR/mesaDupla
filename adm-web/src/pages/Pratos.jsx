import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Pratos() {
    const [pratos, setPratos] = useState([]);
    const [restaurants, setRestaurants] = useState([]);

    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [restaurantId, setRestaurantId] = useState("");
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    async function load() {
        try {
            const [resPratos, resRestaurants] = await Promise.all([
                api.get("/pratos"),
                api.get("/restaurantes"),
            ]);

            setPratos(resPratos.data);
            setRestaurants(resRestaurants.data);
        } catch {
            toast.error("Erro ao carregar dados");
        }
    }

    async function createOrUpdate(e) {
        e.preventDefault();
        setLoading(true);

        try {
            if (editing) {
                await api.put(`/pratos/${editing.id}`, {
                    nome,
                    descricao,
                    preco,
                    restaurante_id: restaurantId,
                });
                toast.success("Prato atualizado");
            } else {
                await api.post("/pratos", {
                    nome,
                    descricao,
                    preco,
                    restaurante_id: restaurantId,
                    cidade_id: user.cidade_id,
                });
                toast.success("Prato criado");
            }

            reset();
            await load();
        } catch {
            toast.error("Erro ao salvar prato");
        } finally {
            setLoading(false);
        }
    }

    async function remove(id) {
        if (!window.confirm("Deseja deletar?")) return;

        try {
            await api.delete(`/pratos/${id}`);
            toast.success("Prato deletado");
            await load();
        } catch {
            toast.error("Erro ao deletar");
        }
    }

    function startEdit(p) {
        setEditing(p);
        setNome(p.nome);
        setDescricao(p.descricao);
        setPreco(p.preco);
        setRestaurantId(p.restaurante_id);
    }

    function reset() {
        setNome("");
        setDescricao("");
        setPreco("");
        setRestaurantId("");
        setEditing(null);
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Pratos</h1>

            <form onSubmit={createOrUpdate} className="mb-6 grid grid-cols-4 gap-4">
                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <input
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <input
                    type="number"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <select
                    value={restaurantId}
                    onChange={(e) => setRestaurantId(e.target.value)}
                    className="p-2 rounded bg-card"
                >
                    <option value="">Restaurante</option>
                    {restaurants.map((r) => (
                        <option key={r.id} value={r.id}>
                            {r.nome}
                        </option>
                    ))}
                </select>

                <button
                    disabled={loading}
                    className="col-span-4 bg-primary text-black py-2 rounded"
                >
                    {loading
                        ? "Salvando..."
                        : editing
                        ? "Atualizar Prato"
                        : "Criar Prato"}
                </button>

                {editing && (
                    <button
                        type="button"
                        onClick={reset}
                        className="col-span-4 bg-muted py-2 rounded"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <div className="bg-card p-4 rounded-xl">
                {pratos.length === 0 && (
                    <p className="text-muted">Nenhum prato encontrado</p>
                )}

                {pratos.map((p) => (
                    <div
                        key={p.id}
                        className="flex justify-between border-b border-muted py-2"
                    >
                        <div>
                            <p className="font-semibold">{p.nome}</p>
                            <p className="text-sm text-muted">
                                {p.descricao}
                            </p>
                            <p className="text-sm">R$ {p.preco}</p>
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