import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("/auth/login", {
                email,
                senha,
            });

            const { token, usuario } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(usuario));

            toast.success("Login realizado");
            navigate("/");
        } catch (err) {
            toast.error("Email ou senha inválidos", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <form
                onSubmit={handleLogin}
                className="bg-card p-8 rounded-xl w-80 shadow-lg"
            >
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Login Admin
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full mb-4 p-2 rounded bg-background outline-none focus:ring-2 focus:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    className="w-full mb-4 p-2 rounded bg-background outline-none focus:ring-2 focus:ring-primary"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-black py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </div>
    );
}