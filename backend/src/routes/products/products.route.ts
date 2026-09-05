import express from "express";
import type { Product } from "../../types/product.ts";
import { searchAllProducts } from "../../libs/search/searchProducts.ts";
import { searchWillysProducts } from "../../retailers/willys/willys.client.ts";
import { searchIcaProducts } from "../../retailers/ica/ica.client.ts";
import { searchHemkopProducts } from "../../retailers/hemkop/hemkop.client.ts";
import { searchCoopProducts } from "../../retailers/coop/coop.client.ts";
import { searchCityGrossProducts } from "../../retailers/citygross/citygross.client.ts";

const ICA_STORE_ID = process.env.ICA_STORE_ID;
if (!ICA_STORE_ID) {
    throw new Error("ICA_STORE_ID environment variable is not set");
}

const COOP_SUBSCRIPTION_KEY = process.env.COOP_SUBSCRIPTION_KEY;
if (!COOP_SUBSCRIPTION_KEY) {
    throw new Error("COOP_SUBSCRIPTION_KEY environment variable is not set");
}
const COOP_STORE_ID = process.env.COOP_STORE_ID;
if (!COOP_STORE_ID) {
    throw new Error("COOP_STORE_ID environment variable is not set");
}

const router = express.Router();

router.get("/", async (req, res) => {
    const query =
        typeof req.query.q === "string"
            ? req.query.q.trim()
            : "";

    if (!query) {
        return res.status(400).json({
            error: "Query parameter 'q' is required",
        });
    }

    try {
        const result = await searchAllProducts({
            query,
            icaStoreId: ICA_STORE_ID,
            coopStoreId: COOP_STORE_ID,
            coopSubscriptionKey:
                COOP_SUBSCRIPTION_KEY,
        });

        return res.json(result);
    } catch (error) {
        console.error(
            "Grouped product search failed",
            error,
        );

        return res.status(500).json({
            error: "Failed to search products",
        });
    }
});

export default router;