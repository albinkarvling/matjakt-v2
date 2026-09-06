import { MAX_PAGE_SIZE } from "../../constants/requestInfo.ts";
import { fetchJson } from "../../libs/http.ts";
import type { Product } from "../../types/product.ts";
import type { CoopSearchResponse } from "../../types/retailers/coop.ts";
import { mapCoopProduct } from "./coop.mapper.ts";

const COOP_BASE_URL = "https://external.api.coop.se/personalization/search/global";

type SearchCoopProductsOptions = {
    storeId: string;
    query: string;
    subscriptionKey: string;
};

export async function searchCoopProducts({
    storeId,
    query,
    subscriptionKey,
}: SearchCoopProductsOptions): Promise<Product[]> {
    const url = new URL(COOP_BASE_URL);

    url.searchParams.set("api-version", "v1");
    url.searchParams.set("store", storeId);
    url.searchParams.set("groups", "CUSTOMER_PRIVATE");
    url.searchParams.set("device", "desktop");
    url.searchParams.set("direct", "false");

    const response = await fetchJson<CoopSearchResponse>(url.toString(), {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "ocp-apim-subscription-key": subscriptionKey,
            origin: "https://www.coop.se",
            referer: "https://www.coop.se/",
        },
        body: JSON.stringify({
            query,
            resultsOptions: {
                skip: 0,
                take: MAX_PAGE_SIZE,
                sortBy: [],
                facets: [],
            },
            customData: {
                consent: true,
            },
        }),
    });

    const items = response.results.items;
    console.log(items?.at(0));

    return items.map(mapCoopProduct).filter((product): product is Product => product !== null);
}
