import { BROWSER_USER_AGENT, fetchJson } from "../../libs/http.ts";
import type { Product } from "../../types/product.ts";
import type {
    WillysApiProduct,
    WillysSearchResponse,
} from "../../types/retailers/axfood.ts";
import { mapAxfoodProduct } from "../axfood/axfood.mapper.ts";

const HEMKOP_BASE_URL = "https://www.hemkop.se";
const DEFAULT_PAGE_SIZE = 20;

export async function searchHemkopProducts({
    query,
    page = 0,
    size = DEFAULT_PAGE_SIZE,
}: {
    query: string;
    page?: number;
    size?: number;
}): Promise<Product[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
        return [];
    }

    const url = new URL("/axfood/rest/v1/search", HEMKOP_BASE_URL);

    url.searchParams.set("q", normalizedQuery);
    url.searchParams.set("page", String(page));
    url.searchParams.set("size", String(size));

    const response = await fetchJson<WillysSearchResponse>(url.toString(), {
        headers: {
            accept: "application/json",
            "user-agent": BROWSER_USER_AGENT,
            referer: `${HEMKOP_BASE_URL}/`,
        },
    });

    return response.results
        .map((product: WillysApiProduct) =>
            mapAxfoodProduct(product, "hemkop"),
        )
        .filter((product): product is Product => product !== null);
}