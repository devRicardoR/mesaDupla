import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roles = [] }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
        return <Navigate to="/login" />;
    }

    // Se tiver roles definidas, valida tipo_usuario
    if (roles.length > 0 && !roles.includes(user.tipo_usuario)) {
        return <Navigate to="/" />;
    }

    return children;
}