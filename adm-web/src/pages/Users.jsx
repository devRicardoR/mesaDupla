import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [tipo, setTipo] = useState("CLIENTE");
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    async function load() {
        try {
            const res = await api.get("/usuarios");
            setUsers(res.data);
        } catch {
            toast.error("Erro ao carregar usuários");
        }
    }

    async function create(e) {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/usuarios", {
                nome,
                email,
                senha,
                tipo_usuario: tipo,
                cidade_id: user.cidade_id,
            });

            toast.success("Usuário criado");

            setNome("");
            setEmail("");
            setSenha("");
            setTipo("CLIENTE");

            await load();
        } catch {
            toast.error("Erro ao criar usuário");
        } finally {
            setLoading(false);
        }
    }

    async function remove(id) {
        const confirmDelete = window.confirm("Deseja deletar?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/usuarios/${id}`);
            toast.success("Usuário deletado");
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
            <h1 className="text-3xl font-bold mb-6">Usuários</h1>

            <form onSubmit={create} className="mb-6 grid grid-cols-4 gap-4">
                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="p-2 rounded bg-card"
                />

                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="p-2 rounded bg-card"
                >
                    <option value="ADMIN">ADMIN</option>
                    <option value="RESTAURANTE">RESTAURANTE</option>
                    <option value="CLIENTE">CLIENTE</option>
                </select>

                <button
                    disabled={loading}
                    className="col-span-4 bg-primary text-black py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Criando..." : "Criar Usuário"}
                </button>
            </form>

            <div className="bg-card p-4 rounded-xl">
                {users.length === 0 && (
                    <p className="text-muted">Nenhum usuário encontrado</p>
                )}

                {users.map((u) => (
                    <div
                        key={u.id}
                        className="flex justify-between border-b border-muted py-2"
                    >
                        <div>
                            <p className="font-semibold">{u.nome}</p>
                            <p className="text-sm text-muted">{u.email}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm">{u.tipo_usuario}</span>

                            <button
                                onClick={() => remove(u.id)}
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