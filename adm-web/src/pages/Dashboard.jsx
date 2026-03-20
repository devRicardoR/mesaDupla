import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [dados, setDados] = useState(null);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            const res = await getDashboard();
            setDados(res);
        } catch {
            toast.error("Erro ao carregar dashboard");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return <p className="text-muted">Carregando dashboard...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-4 gap-6">
                
                <Card title="Usuários" value={dados.usuarios} />
                <Card title="Restaurantes" value={dados.restaurantes} />
                <Card title="Assinaturas Ativas" value={dados.assinaturas} />
                <Card 
                    title="Receita (R$)" 
                    value={`R$ ${Number(dados.receita).toFixed(2)}`} 
                />

            </div>
        </div>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-card p-6 rounded-xl hover:scale-[1.02] transition">
            <p className="text-muted">{title}</p>
            <h2 className="text-2xl font-bold text-primary">
                {value}
            </h2>
        </div>
    );
}