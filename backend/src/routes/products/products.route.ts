import express from "express";
import type { Product } from "../../types/product.ts";
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
        if (retailer === "hemkop") {
            products = await searchHemkopProducts({ query });
        }
        if (retailer === "coop") {
            products = await searchCoopProducts({
                query,
                subscriptionKey: COOP_SUBSCRIPTION_KEY,
                storeId: COOP_STORE_ID
            });
        }
        if (retailer === "citygross") {
            products = await searchCityGrossProducts({ query })
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

export default router;