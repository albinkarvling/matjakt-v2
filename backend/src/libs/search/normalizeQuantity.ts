import type { NormalizedQuantity } from "../../types/product.ts";
import { normalizeText } from "./normalizeText.ts";

export function normalizeQuantity(
    packageSize: string | null,
): NormalizedQuantity | null {
    if (!packageSize) {
        return null;
    }

    const text = normalizeText(packageSize);

    const approximate =
        /\b(ca|cirka|ungefar|ungefarlig)\b/.test(text) ||
        text.startsWith("ca");

    const match = text.match(
        /(\d+(?:\.\d+)?)\s*(kilogram|kg|gram|g|liter|litre|l|dl|cl|ml)\b/,
    );

    if (!match) {
        return null;
    }

    const amount = Number(match[1]);
    const unit = match[2];

    switch (unit) {
        case "kilogram":
        case "kg":
            return {
                value: amount * 1000,
                unit: "g",
                approximate,
            };

        case "gram":
        case "g":
            return {
                value: amount,
                unit: "g",
                approximate,
            };

        case "liter":
        case "litre":
        case "l":
            return {
                value: amount * 1000,
                unit: "ml",
                approximate,
            };

        case "dl":
            return {
                value: amount * 100,
                unit: "ml",
                approximate,
            };

        case "cl":
            return {
                value: amount * 10,
                unit: "ml",
                approximate,
            };

        case "ml":
            return {
                value: amount,
                unit: "ml",
                approximate,
            };

        default:
            return null;
    }
}