import { normalizeGtin } from "../../libs/gtin.ts";
import { cleanBrand, forceHttps, toMoney } from "../../libs/product.ts";
import type { CoopProduct } from "../../types/retailers/coop.ts";
import type { Product, UnitPrice } from "../../types/product.ts";

export function mapCoopProduct(raw: CoopProduct): Product | null {
    const price = raw.salesPriceData?.b2cPrice;

    if (price == null) {
        return null;
    }

    const gtin = normalizeGtin(raw.ean ?? raw.id);

    let unitPrice: UnitPrice | null = null;

    if (raw.comparativePriceData?.b2cPrice != null) {
        unitPrice = {
            price: toMoney(raw.comparativePriceData.b2cPrice),
            unit: raw.comparativePriceUnit?.unit ?? "",
            unitName: raw.comparativePriceUnit?.text ?? "",
        };
    }

    return {
        retailer: "coop",
        retailerProductId: String(raw.id),

        gtin,
        gtinSource: gtin ? "retailer-api" : null,

        name: raw.name,
        brand: cleanBrand(raw.manufacturerName),
        packageSize: raw.packageSizeInformation ?? null,

        price: toMoney(price),
        unitPrice,

        imageUrl: normalizeCoopImageUrl(raw.imageUrl),
        available: raw.availableOnline ?? null,
    };
}

function normalizeCoopImageUrl(
    value: string | null | undefined,
): string | null {
    const url = forceHttps(value);

    if (!url) {
        return null;
    }

    if (url.includes("/image/upload/")) {
        return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
    }

    return url;
}