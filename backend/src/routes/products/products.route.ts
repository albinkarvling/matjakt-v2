import express from "express";
import { searchProductsWithCache } from "../../libs/search/searchProductsWithCache.ts";

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
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

    if (query.length < 2) {
        return res.status(400).json({
            error: "Search query must contain at least 2 characters",
        });
    }

    if (query.length > 100) {
        return res.status(400).json({
            error: "Search query must not exceed 100 characters",
        });
    }

    try {
        const result = await searchProductsWithCache({
            query,
            icaStoreId: ICA_STORE_ID,
            coopStoreId: COOP_STORE_ID,
            coopSubscriptionKey: COOP_SUBSCRIPTION_KEY,
        });

        return res.json(result);
    } catch (error) {
        console.error("Grouped product search failed", error);

        return res.status(500).json({
            error: "Failed to search products",
        });
    }
});

export default router;
