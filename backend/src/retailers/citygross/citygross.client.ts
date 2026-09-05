import { fetchJson } from "../../libs/http.ts";
import type {
    CityGrossApiProduct,
    CityGrossSearchResponse,
} from "../../types/retailers/citygross.ts";
import type { Product } from "../../types/product.ts";
import { mapCityGrossProduct } from "./citygross.mapper.ts";

const CITY_GROSS_BASE_URL = "https://www.citygross.se";

type Params = {
    query: string;
};

export async function searchCityGrossProducts({ query }: Params): Promise<Product[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
        return [];
    }

    const url = new URL("/api/v1/Loop54/search", CITY_GROSS_BASE_URL);

    url.searchParams.set("SearchQuery", normalizedQuery);
    url.searchParams.set("skip", "0");
    url.searchParams.set("store", "");
    url.searchParams.set("take", "20");

    const response = await fetchJson<CityGrossSearchResponse>(url.toString());

    return response.searchResults.products
        .map((product: CityGrossApiProduct) =>
            mapCityGrossProduct({
                ...product,
                images: (product.images ?? []).map((image) => ({
                    ...image,
                    url: image.url?.startsWith("http")
                        ? image.url
                        : `${CITY_GROSS_BASE_URL}/images/products/${image.url}`,
                })),
            }),
        )
        .filter((product): product is Product => product !== null);
}