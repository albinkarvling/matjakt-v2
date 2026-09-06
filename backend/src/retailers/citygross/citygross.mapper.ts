import { normalizeGtin } from "../../libs/gtin.ts";
import { cleanBrand, forceHttps, toMoney } from "../../libs/product.ts";
import type { PriceBasis, Product, UnitPrice } from "../../types/product.ts";
import type { CityGrossApiProduct } from "../../types/retailers/citygross.ts";

function mapPriceBasis(unit: string | null): PriceBasis {
    switch (unit?.trim().toUpperCase()) {
        case "KGM":
        case "KG":
            return "kilogram";

        case "LTR":
        case "L":
            return "liter";

        case "EA":
        case "PCE":
        case "H87":
        case "ST":
            return "item";

        default:
            return "unknown";
    }
}

export function mapCityGrossProduct(raw: CityGrossApiProduct): Product | null {
    const sellable = (
        raw as CityGrossApiProduct & {
            sellable?: boolean;
        }
    ).sellable;

    const currentPrice = raw.productStoreDetails?.prices?.currentPrice;

    if (currentPrice?.price == null) {
        return null;
    }

    const gtin = normalizeGtin(raw.gtin);

    let unitPrice: UnitPrice | null = null;

    if (currentPrice.comparativePrice != null) {
        unitPrice = {
            price: toMoney(currentPrice.comparativePrice),
            unit: currentPrice.comparativePriceUnit ?? "",
            unitName: currentPrice.comparativePriceUnit ?? "",
        };
    }

    return {
        retailer: "cityGross",
        retailerProductId: String(raw.id),

        gtin,
        gtinSource: gtin ? "retailer-api" : null,

        name: raw.name,
        brand: cleanBrand(raw.brand),
        packageSize: raw.descriptiveSize ?? null,

        price: toMoney(currentPrice.price),
        unitPrice,
        priceBasis: mapPriceBasis(currentPrice.unit),

        imageUrl: forceHttps(raw.images?.[0]?.url) ?? null,

        available: sellable ?? null,
    };
}
