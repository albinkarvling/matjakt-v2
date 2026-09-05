import express from "express";
import type { Product } from "../../types/product.ts";
import { searchWillysProducts } from "../../retailers/willys/willys.client.ts";
import { searchIcaProducts } from "../../retailers/ica/ica.client.ts";

const ICA_STORE_ID = process.env.ICA_STORE_ID;
if (!ICA_STORE_ID) {
    throw new Error("ICA_STORE_ID environment variable is not set");
}

const router = express.Router();

router.get("/", async (req, res) => {
    const query = req.query.q as string;
    const retailer = req.query.retailer as string;

    if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        let products: Product[] = [];
        if (retailer === "willys") {
            products = await searchWillysProducts({ query });
        }
        if (retailer === "ica") {
            products = await searchIcaProducts(ICA_STORE_ID, query);
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

export default router;