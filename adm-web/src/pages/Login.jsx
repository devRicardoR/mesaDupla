import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        try {
        const res = await api.post("/auth/login", {
            email,
            senha,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("tipo_usuario", res.data.tipo_usuario);

        navigate("/");
        } catch (err) {
        alert("Login inválido");
        console.log(err)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
        <form
            onSubmit={handleLogin}
            className="bg-card p-8 rounded-xl w-80"
        >
            <h1 className="text-2xl font-bold mb-6 text-center">
            Login Admin
            </h1>

            <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 rounded bg-background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <input
            type="password"
            placeholder="Senha"
            className="w-full mb-4 p-2 rounded bg-background"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            />

            <button
            type="submit"
            className="w-full bg-primary text-black py-2 rounded"
            >
            Entrar
            </button>
        </form>
        </div>
    );
}