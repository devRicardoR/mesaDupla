import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";
import Cities from "../pages/Cities";
import Users from "../pages/Users";
import Restaurants from "../pages/Restaurants";
import Plans from "../pages/Plans";
import Payments from "../pages/Payments";
import Pratos from "../pages/Pratos";
import Resgates from "../pages/Resgates";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <PrivateRoute roles={["ADMIN"]}>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/cities"
                    element={
                        <PrivateRoute roles={["ADMIN"]}>
                            <MainLayout>
                                <Cities />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/users"
                    element={
                        <PrivateRoute roles={["ADMIN"]}>
                            <MainLayout>
                                <Users />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/restaurants"
                    element={
                        <PrivateRoute roles={["ADMIN"]}>
                            <MainLayout>
                                <Restaurants />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/pratos"
                    element={
                        <PrivateRoute roles={["ADMIN"]}>
                            <MainLayout>
                                <Pratos />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/plans"
                    element={
                        <PrivateRoute roles={["ADMIN"]}>
                            <MainLayout>
                                <Plans />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/payments"
                    element={
                        <PrivateRoute roles={["ADMIN"]}>
                            <MainLayout>
                                <Payments />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/resgates"
                    element={
                        <PrivateRoute roles={["ADMIN"]}>
                            <MainLayout>
                                <Resgates />
                            </MainLayout>
                        </PrivateRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}