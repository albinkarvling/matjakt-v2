import type { ProductGroup } from "../../types/product.ts";
import type { SearchIntent } from "./parseQuery.ts";

const MINIMUM_SCORE = 40;
const MINIMUM_CATEGORY_MATCH = 0.3;

export function isRelevantProductGroup(group: ProductGroup, intent: SearchIntent): boolean {
    /*
     * For known searches such as "mjölk" or "nötfärs",
     * require the product to belong to a compatible category.
     */
    if (intent.profile && group.scoreDetails.categoryMatch < MINIMUM_CATEGORY_MATCH) {
        return false;
    }

    return group.score >= MINIMUM_SCORE;
}
