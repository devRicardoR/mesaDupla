import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Cities() {
    const [cities, setCities] = useState([]);
    const [name, setName] = useState("");
    const [estado, setEstado] = useState("");
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);

    async function load() {
        try {
            const res = await api.get("/cidades");
            setCities(res.data);
        } catch {
            toast.error("Erro ao carregar cidades");
        }
    }

    async function createOrUpdate(e) {
        e.preventDefault();
        setLoading(true);

        try {
            if (editing) {
                await api.put(`/cidades/${editing.id}`, {
                    nome: name,
                    estado
                });
                toast.success("Cidade atualizada");
            } else {
                await api.post("/cidades", {
                    nome: name,
                    estado
                });
                toast.success("Cidade criada");
            }

            setName("");
            setEstado("");
            setEditing(null);
            await load();
        } catch (err) {
            console.log(err.response?.data);
            toast.error("Erro ao salvar cidade");
        } finally {
            setLoading(false);
        }
    }

    async function remove(id) {
        const confirmDelete = window.confirm("Deseja deletar?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/cidades/${id}`);
            toast.success("Cidade deletada");
            await load();
        } catch {
            toast.error("Erro ao deletar");
        }
    }

    function startEdit(city) {
        setEditing(city);
        setName(city.nome);
        setEstado(city.estado);
    }

    function cancelEdit() {
        setEditing(null);
        setName("");
        setEstado("");
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Cities</h1>

            <form onSubmit={createOrUpdate} className="mb-6 flex gap-4">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome da cidade"
                    className="p-2 rounded bg-card flex-1"
                />

                <input
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    placeholder="Estado (ex: PR)"
                    className="p-2 rounded bg-card w-32"
                />

                <button
                    disabled={loading}
                    className="bg-primary text-black px-4 rounded disabled:opacity-50"
                >
                    {loading
                        ? "Salvando..."
                        : editing
                        ? "Atualizar"
                        : "Criar"}
                </button>

                {editing && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 rounded bg-muted"
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <div className="bg-card p-4 rounded-xl">
                {cities.length === 0 && (
                    <p className="text-muted">Nenhuma cidade encontrada</p>
                )}

                {cities.map((c) => (
                    <div
                        key={c.id}
                        className="flex justify-between items-center border-b border-muted py-2"
                    >
                        <span>
                            {c.nome} - {c.estado}
                        </span>

                        <div className="flex gap-3">
                            <button
                                onClick={() => startEdit(c)}
                                className="text-blue-400"
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => remove(c.id)}
                                className="text-danger"
                            >
                                Deletar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}