import { Link, useNavigate, useLocation } from "react-router-dom";

export default function MainLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    function isActive(path) {
        return location.pathname === path
            ? "text-primary font-semibold"
            : "hover:text-primary";
    }

    return (
        <div className="flex min-h-screen bg-background text-text">
        
            <aside className="w-64 bg-card p-4 flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary mb-6">
                        MesaDupla
                    </h1>

                    <nav className="flex flex-col gap-3">
                        <Link to="/" className={isActive("/")}>Dashboard</Link>
                        <Link to="/cities" className={isActive("/cities")}>Cities</Link>
                        <Link to="/users" className={isActive("/users")}>Users</Link>
                        <Link to="/restaurants" className={isActive("/restaurants")}>Restaurants</Link>
                        <Link to="/pratos" className={isActive("/pratos")}>Pratos</Link>
                        <Link to="/plans" className={isActive("/plans")}>Plans</Link>
                        <Link to="/payments" className={isActive("/payments")}>Payments</Link>
                        <Link to="/resgates" className={isActive("/resgates")}>Resgates</Link>                        
                    </nav>
                </div>

                <div className="text-sm text-muted">
                    <p>{user?.nome}</p>
                    <p>{user?.tipo_usuario}</p>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">

                <header className="h-16 bg-card flex items-center justify-between px-6">
                    <p className="text-muted">
                        {user?.tipo_usuario} • Cidade #{user?.cidade_id}
                    </p>

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