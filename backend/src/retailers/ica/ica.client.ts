import { fetchJson } from "../../libs/http.ts";
import type { IcaSearchResponse } from "../../types/retailers/ica.ts";
import type { Product } from "../../types/product.ts";
import { mapIcaProduct } from "./ica.mapper.ts";
import { MAX_PAGE_SIZE } from "../../constants/requestInfo.ts";

const ICA_BASE_URL = "https://handlaprivatkund.ica.se/stores";

export async function searchIcaProducts(
    storeId: string,
    query: string,
): Promise<Product[]> {
    const url = new URL(
        `${ICA_BASE_URL}/${storeId}/api/webproductpagews/v6/product-pages/search`,
    );

    url.searchParams.set("q", query);
    url.searchParams.set("maxPageSize", String(MAX_PAGE_SIZE));
    url.searchParams.set("maxProductsToDecorate", String(MAX_PAGE_SIZE));
    url.searchParams.set("includeAdditionalPageInfo", "true");
    url.searchParams.set("tag", "web");

    const response = await fetchJson<IcaSearchResponse>(
        url.toString(),
    );

    const rawProducts = response.productGroups.flatMap(
        (group) => group.decoratedProducts ?? [],
    );

    const uniqueProducts = new Map<string, typeof rawProducts[number]>();

    for (const rawProduct of rawProducts) {
        const id = String(rawProduct.retailerProductId);

        if (!uniqueProducts.has(id)) {
            uniqueProducts.set(id, rawProduct);
        }
    }

    return [...uniqueProducts.values()].map((product) =>
        mapIcaProduct(product),
    );
}