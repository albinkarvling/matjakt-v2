import { searchCityGrossProducts } from "../../retailers/citygross/citygross.client.ts";
import { searchCoopProducts } from "../../retailers/coop/coop.client.ts";
import { searchHemkopProducts } from "../../retailers/hemkop/hemkop.client.ts";
import { searchIcaProducts } from "../../retailers/ica/ica.client.ts";
import { searchWillysProducts } from "../../retailers/willys/willys.client.ts";
import type {
    Product,
    ProductGroup,
    ProductSearchResult,
    Retailer,
    SearchOptions,
} from "../../types/product.ts";
import { groupProducts } from "./groupProducts.ts";
import { normalizeSearchProduct } from "./normalizeProduct.ts";
import { parseQuery } from "./parseQuery.ts";
import { scoreProductGroup } from "./scoreProductGroup.ts";

export async function searchAllProducts({
    query,
    icaStoreId,
    coopStoreId,
    coopSubscriptionKey,
    retailers = ["ica", "coop", "willys", "hemkop", "cityGross"],
}: SearchOptions): Promise<ProductSearchResult> {
    const searches: Partial<Record<Retailer, () => Promise<Product[]>>> = {
        ica: () => searchIcaProducts(icaStoreId, query),
        coop: () =>
            searchCoopProducts({
                query,
                storeId: coopStoreId,
                subscriptionKey: coopSubscriptionKey,
            }),
        willys: () => searchWillysProducts({ query }),
        hemkop: () => searchHemkopProducts({ query }),
        cityGross: () => searchCityGrossProducts({ query }),
    };

    const results = await Promise.all(
        retailers.map(async (retailer) => {
            const search = searches[retailer];

            if (!search) {
                return {
                    retailer,
                    products: [],
                    error: "Retailer not implemented",
                };
            }

            try {
                return {
                    retailer,
                    products: await search(),
                    error: null,
                };
            } catch (error) {
                console.error(`Product search failed for ${retailer}`, error);

                return {
                    retailer,
                    products: [],
                    error: "Search failed",
                };
            }
        }),
    );

    const normalizedProducts = results.flatMap(({ products }) =>
        products.map((product, retailerRank) => normalizeSearchProduct(product, retailerRank)),
    );

    const intent = parseQuery(query);

    const groups = groupProducts(normalizedProducts)
        .map((group) => scoreProductGroup(group, intent))
        .map(sortOffers)
        .sort((a, b) => {
            if (a.score !== b.score) {
                return b.score - a.score;
            }

            return b.offers.length - a.offers.length;
        });

    return {
        groups,
        retailers: results,
    };
}

function sortOffers(group: ProductGroup): ProductGroup {
    return {
        ...group,
        offers: [...group.offers].sort((a, b) => {
            if (a.available !== b.available) {
                return a.available === true ? -1 : 1;
            }

            return Number(a.price.amount) - Number(b.price.amount);
        }),
    };
}
