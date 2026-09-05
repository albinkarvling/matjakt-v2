import type { Money } from "../types/product.ts";

export function toMoney(amount: number | string): Money {
    const parsed =
        typeof amount === "number"
            ? amount
            : Number(String(amount).replace(",", "."));

    if (!Number.isFinite(parsed)) {
        throw new Error(`Invalid price amount: ${amount}`);
    }

    return {
        amount: parsed.toFixed(2),
        currency: "SEK",
    };
}

export function cleanBrand(
    brand: string | null | undefined,
): string | null {
    const cleaned = brand
        ?.replace(/[®™]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    return cleaned || null;
}

export function forceHttps(
    url: string | null | undefined,
): string | null {
    if (!url) {
        return null;
    }

    return url.replace(/^http:\/\//, "https://");
}

export function parsePriceText(
    value: string | null | undefined,
): number | null {
    if (!value) {
        return null;
    }

    const normalized = value
        .replace(/\s/g, "")
        .replace(/[^\d,.-]/g, "")
        .replace(",", ".");

    const parsed = Number(normalized);

    return Number.isFinite(parsed) ? parsed : null;
}