import { useEffect, useState } from "react";
import api from "../services/api";

export default function Cities() {
    const [cities, setCities] = useState([]);
    const [name, setName] = useState("");

    async function load() {
        const res = await api.get("/cidades");
        setCities(res.data);
    }

    async function create(e) {
        e.preventDefault();

        await api.post("/cidades", { nome: name });
        setName("");
        await load();
    }

    async function remove(id) {
        await api.delete(`/cidades/${id}`);
        await load();
    }

    useEffect(() => {
        async function init() {
        await load();
        }
        init();
    }, []);

    return (
        <div>
        <h1 className="text-3xl font-bold mb-6">Cities</h1>

        <form onSubmit={create} className="mb-6 flex gap-4">
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="City name"
            className="p-2 rounded bg-card"
            />
            <button className="bg-primary text-black px-4 rounded">
            Create
            </button>
        </form>

        <div className="bg-card p-4 rounded-xl">
            {cities.map((c) => (
            <div
                key={c.id}
                className="flex justify-between border-b border-muted py-2"
            >
                <span>{c.nome}</span>
                <button
                onClick={() => remove(c.id)}
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