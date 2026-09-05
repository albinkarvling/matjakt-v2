import type {
    ProductGroup,
    Retailer,
    SearchProduct,
} from "../../types/product.ts";

function isRestrictedGtin(gtin: string): boolean {
    /*
     * GTIN-14 beginning with 02 can be a restricted-circulation
     * or variable-measure number.
     */
    return gtin.startsWith("02");
}

function getCatalogScope(
    retailer: Retailer,
): string {
    switch (retailer) {
        case "willys":
        case "hemkop":
        case "cityGross":
            return "axfood";

        case "coop":
            return "coop";

        case "ica":
            return "ica";

        case "lidl":
            return "lidl";
    }
}

function getGroupKey(
    product: SearchProduct,
): string {
    if (!product.gtin) {
        return [
            "retailer-product",
            product.retailer,
            product.retailerProductId,
        ].join(":");
    }

    if (isRestrictedGtin(product.gtin)) {
        return [
            "restricted-gtin",
            getCatalogScope(product.retailer),
            product.gtin,
        ].join(":");
    }

    return `gtin:${product.gtin}`;
}

function selectCanonicalProduct(
    offers: SearchProduct[],
): SearchProduct {
    return [...offers].sort((a, b) => {
        const score = (product: SearchProduct) =>
            product.name.length +
            (product.brand ? 5 : 0) +
            (product.identity.fatPercent !== null
                ? 5
                : 0) +
            (product.identity.quantity !== null
                ? 5
                : 0);

        return score(b) - score(a);
    })[0];
}

export function groupProducts(
    products: SearchProduct[],
): ProductGroup[] {
    const grouped = new Map<
        string,
        SearchProduct[]
    >();

    for (const product of products) {
        const key = getGroupKey(product);
        const offers = grouped.get(key) ?? [];

        offers.push(product);
        grouped.set(key, offers);
    }

    return [...grouped.entries()].map(
        ([key, offers]) => ({
            key,
            gtin: offers[0].gtin,
            canonicalProduct:
                selectCanonicalProduct(offers),
            offers,
            score: 0,
            scoreDetails: {
                textMatch: 0,
                categoryMatch: 0,
                modifierMatch: 0,
                packageSuitability: 0,
                retailerConsensus: 0,
                availability: 0,
                mismatchPenalty: 0,
            },
        }),
    );
}