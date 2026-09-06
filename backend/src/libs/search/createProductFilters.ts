import type { NormalizedQuantity, ProductFilter, ProductGroup } from "../../types/product.ts";

export function createProductFilters(groups: ProductGroup[]): ProductFilter[] {
    const quantities = new Map<
        string,
        {
            quantity: NormalizedQuantity;
            count: number;
        }
    >();

    for (const group of groups) {
        const quantity = group.canonicalProduct.identity.quantity;

        if (!quantity) {
            continue;
        }

        const value = createQuantityFilterValue(quantity);

        const existing = quantities.get(value);

        if (existing) {
            existing.count += 1;
        } else {
            quantities.set(value, {
                quantity,
                count: 1,
            });
        }
    }

    const options = [...quantities.entries()]
        .sort(([, a], [, b]) => a.quantity.value - b.quantity.value)
        .map(([value, { quantity, count }]) => ({
            value,
            label: formatQuantity(quantity),
            count,
        }))
        .sort((a, b) => b.count - a.count);

    /*
     * A filter with zero or one option isn't useful.
     */
    if (options.length < 2) {
        return [];
    }

    return [
        {
            id: "quantity",
            label: "Förpackningsstorlek",
            options,
        },
    ];
}

function createQuantityFilterValue(quantity: NormalizedQuantity): string {
    return `${quantity.unit}:${quantity.value}`;
}

function formatQuantity(quantity: NormalizedQuantity): string {
    const { value, unit } = quantity;

    if (unit === "ml" && value >= 1000) {
        return `${formatNumber(value / 1000)} l`;
    }

    if (unit === "g" && value >= 1000) {
        return `${formatNumber(value / 1000)} kg`;
    }

    return `${formatNumber(value)} ${unit}`;
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat("sv-SE", {
        maximumFractionDigits: 2,
    }).format(value);
}
