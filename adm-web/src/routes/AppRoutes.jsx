import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import Cities from "../pages/Cities";

export default function AppRoutes() {
    return (
        <BrowserRouter>
        <Routes>

            <Route path="/login" element={<Login />} />

            <Route
            path="/"
            element={
                <PrivateRoute>
                <MainLayout>
                    <Dashboard />
                </MainLayout>
                </PrivateRoute>
            }
            />

            <Route
            path="/cities"
            element={
                <PrivateRoute>
                <MainLayout>
                    <Cities />
                </MainLayout>
                </PrivateRoute>
            }
            />

        </Routes>
        </BrowserRouter>
    );
}