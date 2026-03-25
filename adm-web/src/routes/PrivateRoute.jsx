import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roles = [] }) {
    const token = localStorage.getItem("token");

    let user = null;
    const storedUser = localStorage.getItem("user");

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
        user = null;
    }

    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    const tipo = user.tipo_usuario || user.tipo;

    if (roles.length > 0 && !roles.includes(tipo)) {
        return <Navigate to="/login" />;
    }

    return children;
}