import { extractGtinFromText } from "../../libs/gtin.ts";
import { forceHttps, parsePriceText, toMoney, cleanBrand } from "../../libs/product.ts";
import type {
    Product,
    Retailer,
    UnitPrice,
} from "../../types/product.ts";
import type { WillysApiProduct } from "../../types/axfood/axfood.ts";

type AxfoodRetailer = Extract<
    Retailer,
    "willys" | "hemkop"
>;

export function mapAxfoodProduct(
    raw: WillysApiProduct,
    retailer: AxfoodRetailer,
): Product | null {
    if (raw.priceValue == null) {
        return null;
    }

    const imageUrl =
        forceHttps(raw.image?.url) ??
        forceHttps(raw.thumbnail?.url);

    const gtin =
        extractGtinFromText(raw.image?.url) ??
        extractGtinFromText(raw.thumbnail?.url);

    const comparativePrice = parsePriceText(
        raw.comparePrice,
    );

    let unitPrice: UnitPrice | null = null;

    if (comparativePrice != null) {
        unitPrice = {
            price: toMoney(comparativePrice),
            unit: raw.comparePriceUnit ?? "",
            unitName: raw.comparePriceUnit ?? "",
        };
    }

    return {
        retailer,
        retailerProductId: String(raw.code),

        gtin,
        gtinSource: gtin ? "image-url" : null,

        name: raw.name,
        brand: cleanBrand(raw.manufacturer),
        packageSize: raw.displayVolume ?? null,

        price: toMoney(raw.priceValue),
        unitPrice,

        imageUrl,
        available:
            raw.online !== false &&
            raw.outOfStock !== true &&
            raw.addToCartDisabled !== true,
    };
}