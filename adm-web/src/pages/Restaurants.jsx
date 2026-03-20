import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [users, setUsers] = useState([]);

    const [nome, setNome] = useState("");
    const [usuarioId, setUsuarioId] = useState("");
    const [endereco, setEndereco] = useState("");
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    async function load() {
        try {
            const [resRestaurants, resUsers] = await Promise.all([
                api.get("/restaurantes"),
                api.get("/usuarios"),
            ]);

            setRestaurants(resRestaurants.data);

            setUsers(
                resUsers.data.filter(
                    (u) => u.tipo_usuario === "RESTAURANTE"
                )
            );
        } catch {
            toast.error("Erro ao carregar dados");
        }
    }

    async function create(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/restaurantes", {
                nome,
                usuario_id: usuarioId,
                endereco,
                cidade_id: user.cidade_id,
            });

            toast.success("Restaurante criado");

            setNome("");
            setUsuarioId("");
            setEndereco("");

            await load();
        } catch {
            toast.error("Erro ao criar restaurante");
        } finally {
            setLoading(false);
        }
    }

    async function remove(id) {
        const confirmDelete = window.confirm("Deseja deletar?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/restaurantes/${id}`);
            toast.success("Restaurante deletado");
            await load();
        } catch {
            toast.error("Erro ao deletar");
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Restaurantes</h1>

            <form onSubmit={create} className="mb-6 grid grid-cols-3 gap-4">
                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <select
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)}
                    className="p-2 rounded bg-card"
                >
                    <option value="">Selecione o dono</option>
                    {users.map((u) => (
                        <option key={u.id} value={u.id}>
                            {u.nome}
                        </option>
                    ))}
                </select>

                <input
                    placeholder="Endereço"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <button
                    disabled={loading}
                    className="col-span-3 bg-primary text-black py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Criando..." : "Criar Restaurante"}
                </button>
            </form>

            <div className="bg-card p-4 rounded-xl">
                {restaurants.length === 0 && (
                    <p className="text-muted">Nenhum restaurante encontrado</p>
                )}

                {restaurants.map((r) => (
                    <div
                        key={r.id}
                        className="flex justify-between border-b border-muted py-2"
                    >
                        <div>
                            <p className="font-semibold">{r.nome}</p>
                            <p className="text-sm text-muted">{r.endereco}</p>
                        </div>

                        <button
                            onClick={() => remove(r.id)}
                            className="text-danger"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}