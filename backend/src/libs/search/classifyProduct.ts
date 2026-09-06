import type { Product, ProductCategory } from "../../types/product.ts";
import { normalizeText } from "./normalizeText.ts";

function includesAny(text: string, terms: readonly string[]): boolean {
    return terms.some((term) => text.includes(term));
}

function includesWordOrCompoundEndingWith(text: string, terms: readonly string[]): boolean {
    const words = text.split(" ");

    return terms.some((term) => words.some((word) => word === term || word.endsWith(term)));
}

export function classifyProduct(product: Product): ProductCategory {
    const text = normalizeText(`${product.name} ${product.brand ?? ""}`);

    /*
     * Contextual categories go first. Otherwise cat food
     * containing "nötfärs" could become ground-beef.
     */
    if (
        includesAny(text, [
            "kattmat",
            "hundmat",
            "for katt",
            "for kastrerad katt",
            "bitar i gele",
            "bitar i sas",
            "mjau",
            "vov",
        ])
    ) {
        return "pet-food";
    }

    if (includesAny(text, ["burek", "paj", "pizza", "lasagne", "fardigratt", "fardig ratt"])) {
        return "prepared-food";
    }

    if (includesAny(text, ["blandfars", "bland fars", "not och gris", "not gris", "50 50"])) {
        return "mixed-mince";
    }

    if (
        includesAny(text, [
            "kycklingfars",
            "kyckling fars",
            "kalkonfars",
            "kalvfars",
            "lammfars",
            "flaskfars",
            "vegofars",
            "formbar fars",
        ])
    ) {
        return "other-mince";
    }

    if (includesAny(text, ["notfars", "not fars", "hamburgerfars", "hamburger fars"])) {
        return "ground-beef";
    }

    if (includesAny(text, ["havredryck", "sojadryck", "mandeldryck"])) {
        return "plant-drink";
    }

    if (text.includes("kvarg")) {
        return "kvarg";
    }

    if (includesAny(text, ["cold brew", "kaffedryck", "kaffekoncentrat"])) {
        return "coffee-drink";
    }

    if (
        includesAny(text, [
            "chokladmjolk",
            "jordgubbsmjolk",
            "smaksatt mjolk",
            "milkshake",
            "pucko",
        ])
    ) {
        return "flavored-milk";
    }

    if (includesWordOrCompoundEndingWith(text, ["mjolk", "mjolkdryck"])) {
        return "milk";
    }

    return "other";
}
