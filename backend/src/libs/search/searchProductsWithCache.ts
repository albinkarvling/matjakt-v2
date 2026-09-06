import {
    getFreshCachedProductSearch,
    upsertCachedProductSearch,
} from "../../../database/productSearchCache.ts";
import type { ProductSearchResponse, Retailer } from "../../types/product.ts";
import { normalizeSearchQuery } from "./normalizeSearchQuery.ts";
import { searchAllProducts } from "./searchProducts.ts";

type SearchOptions = {
    query: string;
    icaStoreId: string;
    coopStoreId: string;
    coopSubscriptionKey: string;
    retailers?: Retailer[];
};

export type CachedSearchResult = ProductSearchResponse & {
    cache: {
        hit: boolean;
        fetchedAt: string;
    };
};

const DEFAULT_RETAILERS: Retailer[] = ["ica", "coop", "willys", "hemkop", "cityGross"];

const FULL_CACHE_TTL_HOURS = Number(process.env.SEARCH_CACHE_TTL_HOURS ?? 24);

const PARTIAL_CACHE_TTL_HOURS = 1;

const SEARCH_VERSION = "v1";

export async function searchProductsWithCache({
    query,
    icaStoreId,
    coopStoreId,
    coopSubscriptionKey,
    retailers = DEFAULT_RETAILERS,
}: SearchOptions): Promise<CachedSearchResult> {
    const normalizedQuery = normalizeSearchQuery(query);

    const scopeKey = [
        SEARCH_VERSION,
        `ica:${icaStoreId}`,
        `coop:${coopStoreId}`,
        `retailers:${[...retailers].sort().join(",")}`,
    ].join("|");

    const cached = await getFreshCachedProductSearch(normalizedQuery, scopeKey);

    if (cached) {
        return {
            ...cached.result,
            cache: {
                hit: true,
                fetchedAt: cached.fetchedAt.toISOString(),
            },
        };
    }

    const result = await searchAllProducts({
        query: normalizedQuery,
        icaStoreId,
        coopStoreId,
        coopSubscriptionKey,
        retailers,
    });

    const successfulRetailerCount = result.retailers.filter(({ error }) => error === null).length;

    const allRetailersSucceeded = successfulRetailerCount === result.retailers.length;

    /*
     * Don't cache when every retailer failed.
     *
     * Cache partial results for only one hour, so a temporary
     * retailer outage doesn't produce incomplete results for
     * the full 24-hour period.
     */
    if (successfulRetailerCount > 0) {
        await upsertCachedProductSearch({
            normalizedQuery,
            scopeKey,
            result,
            ttlHours: allRetailersSucceeded ? FULL_CACHE_TTL_HOURS : PARTIAL_CACHE_TTL_HOURS,
        });
    }

    return {
        ...result,
        cache: {
            hit: false,
            fetchedAt: new Date().toISOString(),
        },
    };
}
