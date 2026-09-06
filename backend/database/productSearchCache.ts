import type { ProductSearchResponse } from "../src/types/product.ts";
import { database } from "./database.ts";

type CacheRow = {
    response: ProductSearchResponse;
    fetched_at: Date;
    expires_at: Date;
};

export type CachedProductSearch = {
    result: ProductSearchResponse;
    fetchedAt: Date;
    expiresAt: Date;
};

export async function getFreshCachedProductSearch(
    normalizedQuery: string,
    scopeKey: string,
): Promise<CachedProductSearch | null> {
    const { rows } = await database.query<CacheRow>(
        `
            SELECT response, fetched_at, expires_at
            FROM product_search_cache
            WHERE normalized_query = $1
              AND scope_key = $2
              AND expires_at > now()
        `,
        [normalizedQuery, scopeKey],
    );

    const row = rows[0];

    if (!row) {
        return null;
    }

    return {
        result: row.response,
        fetchedAt: row.fetched_at,
        expiresAt: row.expires_at,
    };
}

export async function upsertCachedProductSearch({
    normalizedQuery,
    scopeKey,
    result,
    ttlHours,
}: {
    normalizedQuery: string;
    scopeKey: string;
    result: ProductSearchResponse;
    ttlHours: number;
}): Promise<void> {
    await database.query(
        `
            INSERT INTO product_search_cache (
                normalized_query,
                scope_key,
                response,
                fetched_at,
                expires_at
            )
            VALUES (
                $1,
                $2,
                $3::jsonb,
                now(),
                now() + ($4 * interval '1 hour')
            )
            ON CONFLICT (normalized_query, scope_key)
            DO UPDATE SET
                response = EXCLUDED.response,
                fetched_at = EXCLUDED.fetched_at,
                expires_at = EXCLUDED.expires_at,
                updated_at = now()
        `,
        [normalizedQuery, scopeKey, JSON.stringify(result), ttlHours],
    );
}
