import type {
    NormalizedQuantity,
} from "../../types/product.ts";
import {
    CATEGORY_PROFILES,
    type CategoryProfile,
} from "./categoryProfiles.ts";
import { normalizeQuantity } from "./normalizeQuantity.ts";
import { normalizeText } from "./normalizeText.ts";

export type SearchIntent = {
    normalizedQuery: string;
    terms: string[];
    profile: CategoryProfile | null;

    quantity: NormalizedQuantity | null;
    fatPercent: number | null;
    organic: boolean | null;
    frozen: boolean | null;
    country: string | null;
};

function findProfile(
    query: string,
): CategoryProfile | null {
    const matches = CATEGORY_PROFILES.flatMap(
        (profile) =>
            profile.queryAliases
                .filter((alias) => query.includes(alias))
                .map((alias) => ({
                    profile,
                    aliasLength: alias.length,
                })),
    );

    matches.sort(
        (a, b) => b.aliasLength - a.aliasLength,
    );

    return matches[0]?.profile ?? null;
}

function extractCountry(
    query: string,
): string | null {
    const countries = [
        "sverige",
        "irland",
        "danmark",
        "finland",
    ];

    return countries.find((country) =>
        query.includes(country),
    ) ?? null;
}

export function parseQuery(
    query: string,
): SearchIntent {
    const normalizedQuery = normalizeText(query);
    const fatMatch = normalizedQuery.match(
        /(\d+(?:\.\d+)?)\s*%/,
    );
    const quantityMatch = normalizedQuery.match(
        /\d+(?:\.\d+)?\s*(?:kg|g|l|dl|cl|ml)\b/,
    );

    return {
        normalizedQuery,
        terms: normalizedQuery.split(" "),
        profile: findProfile(normalizedQuery),
        quantity: quantityMatch
            ? normalizeQuantity(quantityMatch[0])
            : null,
        fatPercent: fatMatch
            ? Number(fatMatch[1])
            : null,
        organic: /\b(eko|ekologisk|krav)\b/.test(
            normalizedQuery,
        )
            ? true
            : null,
        frozen: normalizedQuery.includes("fryst")
            ? true
            : null,
        country: extractCountry(normalizedQuery),
    };
}