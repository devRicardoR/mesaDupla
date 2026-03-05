import express from "express";
import cors from "cors";

import cidadeRoutes from "./routes/cidadeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/cidades", cidadeRoutes);

export default app;