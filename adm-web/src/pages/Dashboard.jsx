import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";

export default function Dashboard() {
    const [dados, setDados] = useState(null);

    useEffect(() => {
        async function carregar() {
        const res = await getDashboard();
        setDados(res);
        }

        carregar();
    }, []);

    if (!dados) return <p>Carregando...</p>;

    return (
        <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-4 gap-6">
            
            <div className="bg-card p-6 rounded-xl">
            <p className="text-muted">Usuários</p>
            <h2 className="text-2xl font-bold text-primary">
                {dados.usuarios}
            </h2>
            </div>

            <div className="bg-card p-6 rounded-xl">
            <p className="text-muted">Restaurantes</p>
            <h2 className="text-2xl font-bold text-primary">
                {dados.restaurantes}
            </h2>
            </div>

            <div className="bg-card p-6 rounded-xl">
            <p className="text-muted">Assinaturas Ativas</p>
            <h2 className="text-2xl font-bold text-primary">
                {dados.assinaturas}
            </h2>
            </div>

            <div className="bg-card p-6 rounded-xl">
            <p className="text-muted">Receita (R$)</p>
            <h2 className="text-2xl font-bold text-primary">
                {dados.receita}
            </h2>
            </div>

        </div>
        </div>
    );
}