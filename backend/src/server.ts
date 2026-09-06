import "dotenv/config";

import cors from "cors";
import express, { type Express } from "express";
import { rateLimit } from "express-rate-limit";
import productsRouter from "./routes/products/products.route.ts";

const app: Express = express();

const productSearchRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many searches. Please try again shortly.",
    },
});

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3001",
    }),
);

app.use("/products", productSearchRateLimit, productsRouter);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
