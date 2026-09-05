import "dotenv/config";

import cors from "cors";
import express, { type Express } from "express";
import productsRouter from "./routes/products/products.route.ts";

const app: Express = express();

app.use(express.json());

app.use(cors({ origin: "http://localhost:3001" }));
app.use("/products", productsRouter);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
