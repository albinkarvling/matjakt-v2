import type {
    Product,
    ProductIdentity,
    SearchProduct,
} from "../../types/product.ts";
import { classifyProduct } from "./classifyProduct.ts";
import { normalizeQuantity } from "./normalizeQuantity.ts";
import { normalizeText } from "./normalizeText.ts";

function extractCountry(text: string): string | null {
    const countries = [
        "sverige",
        "irland",
        "danmark",
        "finland",
    ];

    return countries.find((country) =>
        text.includes(country),
    ) ?? null;
}

function extractFatPercent(
    text: string,
): number | null {
    const match = text.match(/(\d+(?:\.\d+)?)\s*%/);

    return match ? Number(match[1]) : null;
}

export function extractProductIdentity(
    product: Product,
): ProductIdentity {
    const normalizedName = normalizeText(product.name);

    return {
        normalizedName,
        normalizedBrand: product.brand
            ? normalizeText(product.brand)
            : null,
        category: classifyProduct(product),
        quantity: normalizeQuantity(product.packageSize),
        fatPercent: extractFatPercent(normalizedName),
        organic: /\b(eko|ekologisk|krav)\b/.test(
            normalizedName,
        ),
        lactoseFree:
            normalizedName.includes("laktosfri"),
        frozen: normalizedName.includes("fryst"),
        country: extractCountry(normalizedName),
    };
}

export function normalizeSearchProduct(
    product: Product,
    retailerRank: number,
): SearchProduct {
    return {
        ...product,
        retailerRank,
        identity: extractProductIdentity(product),
    };
}