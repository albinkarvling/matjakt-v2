import { normalizeGtin } from "../../libs/gtin.ts";
import { cleanBrand, forceHttps, toMoney } from "../../libs/product.ts";
import type { IcaProduct } from "../../types/retailers/ica.ts";
import type { Product, UnitPrice } from "../../types/product.ts";

const EMPTY_GTIN_MAP: ReadonlyMap<string, string> = new Map();

export function mapIcaProduct(
    raw: IcaProduct,
): Product {
    const retailerProductId = String(raw.retailerProductId);

    let unitPrice: UnitPrice | null = null;

    if (raw.unitPrice?.price?.amount) {
        unitPrice = {
            price: toMoney(raw.unitPrice.price.amount),
            unit: raw.unitPrice.unit ?? "",
            unitName: raw.unitPrice.unitName ?? "",
        };
    }

    return {
        retailer: "ica",
        retailerProductId,

        gtin: "unknown",
        gtinSource: null,

        name: raw.name,
        brand: cleanBrand(raw.brand),
        packageSize: raw.packSizeDescription ?? null,

        price: toMoney(raw.price.amount),
        unitPrice,

        imageUrl: forceHttps(raw.image?.src),
        available: raw.available ?? null,
    };
}