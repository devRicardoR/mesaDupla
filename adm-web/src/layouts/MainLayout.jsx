import { Link, useNavigate } from "react-router-dom";

export default function MainLayout({ children }) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("tipo_usuario");
        navigate("/login");
    }

    return (
        <div className="flex min-h-screen bg-background text-text">
        
        <aside className="w-64 bg-card p-4">
            <h1 className="text-2xl font-bold text-primary mb-6">
            MesaDupla
            </h1>

            <nav className="flex flex-col gap-3">
            <Link to="/" className="hover:text-primary">Dashboard</Link>
            <Link to="/cities" className="hover:text-primary">Cities</Link>
            <Link to="/users" className="hover:text-primary">Users</Link>
            <Link to="/restaurants" className="hover:text-primary">Restaurants</Link>
            <Link to="/plans" className="hover:text-primary">Plans</Link>
            <Link to="/payments" className="hover:text-primary">Payments</Link>
            </nav>
        </aside>

        <div className="flex-1 flex flex-col">

            <header className="h-16 bg-card flex items-center justify-end px-6">
            <button
                onClick={handleLogout}
                className="bg-primary text-black px-4 py-2 rounded-lg"
            >
                Logout
            </button>
            </header>

            <main className="flex-1 p-6">
            {children}
            </main>

        </div>
        </div>
    );
}