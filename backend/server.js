import app from "./src/app.js";
import dotenv from "dotenv";
import createSchema from "./src/db/schema.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

(async () => {
    await createSchema();
    console.log("Schema conferido/criado");

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
})();