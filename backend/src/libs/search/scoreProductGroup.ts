import type {
    ProductGroup,
    ProductIdentity,
    ProductScoreDetails,
} from "../../types/product.ts";
import type {
    SearchIntent,
} from "./parseQuery.ts";

function clamp(value: number): number {
    return Math.max(0, Math.min(1, value));
}

function getTextMatch(
    intent: SearchIntent,
    identity: ProductIdentity,
): number {
    const name = identity.normalizedName;
    const query = intent.normalizedQuery;

    if (name === query) {
        return 1;
    }

    if (name.startsWith(`${query} `)) {
        return 0.95;
    }

    if (name.includes(query)) {
        return 0.85;
    }

    const matchedTerms = intent.terms.filter(
        (term) =>
            name.includes(term) ||
            name
                .split(" ")
                .some((word) => word.endsWith(term)),
    );

    return clamp(
        matchedTerms.length /
        Math.max(intent.terms.length, 1),
    );
}

function getCategoryMatch(
    intent: SearchIntent,
    identity: ProductIdentity,
): number {
    if (!intent.profile) {
        return 0.5;
    }

    return (
        intent.profile.categoryScores[
        identity.category
        ] ?? 0
    );
}

function getModifierMatch(
    intent: SearchIntent,
    identity: ProductIdentity,
): number {
    const scores: number[] = [];

    if (intent.fatPercent !== null) {
        scores.push(
            identity.fatPercent === intent.fatPercent
                ? 1
                : 0,
        );
    }

    if (intent.organic !== null) {
        scores.push(
            identity.organic === intent.organic
                ? 1
                : 0,
        );
    }

    if (intent.frozen !== null) {
        scores.push(
            identity.frozen === intent.frozen
                ? 1
                : 0,
        );
    }

    if (intent.country !== null) {
        scores.push(
            identity.country === intent.country
                ? 1
                : 0,
        );
    }

    if (
        intent.quantity &&
        identity.quantity
    ) {
        if (
            intent.quantity.unit !==
            identity.quantity.unit
        ) {
            scores.push(0);
        } else {
            const difference = Math.abs(
                intent.quantity.value -
                identity.quantity.value,
            );
            const ratio =
                difference /
                Math.max(intent.quantity.value, 1);

            scores.push(
                ratio === 0
                    ? 1
                    : ratio <= 0.1
                        ? 0.8
                        : 0,
            );
        }
    }

    if (scores.length === 0) {
        return 0.5;
    }

    return (
        scores.reduce(
            (total, score) => total + score,
            0,
        ) / scores.length
    );
}

function getPackageSuitability(
    intent: SearchIntent,
    identity: ProductIdentity,
): number {
    const quantity = identity.quantity;

    /*
     * Explicit quantity is more important than a generic
     * category preference.
     */
    if (intent.quantity && quantity) {
        if (intent.quantity.unit !== quantity.unit) {
            return 0;
        }

        const ratio =
            Math.abs(
                intent.quantity.value - quantity.value,
            ) / Math.max(intent.quantity.value, 1);

        return clamp(1 - ratio);
    }

    const preferred =
        intent.profile?.preferredQuantity;

    if (!preferred || !quantity) {
        return 0.5;
    }

    if (preferred.unit !== quantity.unit) {
        return 0;
    }

    if (
        quantity.value >= preferred.min &&
        quantity.value <= preferred.max
    ) {
        return 1;
    }

    const distance =
        quantity.value < preferred.min
            ? preferred.min - quantity.value
            : quantity.value - preferred.max;

    const range = preferred.max - preferred.min;

    return Math.max(
        0.2,
        1 - distance / Math.max(range, 1),
    );
}

function getRetailerConsensus(
    group: ProductGroup,
): number {
    const retailers = new Set(
        group.offers.map((offer) => offer.retailer),
    );

    const reciprocalRank = group.offers.reduce(
        (total, offer) =>
            total + 1 / (20 + offer.retailerRank),
        0,
    );

    const retailerCoverage = clamp(
        retailers.size / 3,
    );
    const originalRankQuality = clamp(
        reciprocalRank / 0.12,
    );

    return (
        retailerCoverage * 0.6 +
        originalRankQuality * 0.4
    );
}

function getMismatchPenalty(
    intent: SearchIntent,
    identity: ProductIdentity,
): number {
    let penalty = 0;

    for (
        const rule of
        intent.profile?.negativeTerms ?? []
    ) {
        if (
            identity.normalizedName.includes(
                rule.term,
            )
        ) {
            penalty += rule.penalty;
        }
    }

    if (
        intent.fatPercent !== null &&
        identity.fatPercent !== null &&
        intent.fatPercent !== identity.fatPercent
    ) {
        penalty += 20;
    }

    if (
        intent.organic === true &&
        !identity.organic
    ) {
        penalty += 40;
    }

    if (
        intent.frozen === true &&
        !identity.frozen
    ) {
        penalty += 30;
    }

    if (
        intent.country &&
        identity.country &&
        intent.country !== identity.country
    ) {
        penalty += 40;
    }

    return penalty;
}

export function scoreProductGroup(
    group: ProductGroup,
    intent: SearchIntent,
): ProductGroup {
    const identity =
        group.canonicalProduct.identity;

    const scoreDetails: ProductScoreDetails = {
        textMatch: getTextMatch(
            intent,
            identity,
        ),
        categoryMatch: getCategoryMatch(
            intent,
            identity,
        ),
        modifierMatch: getModifierMatch(
            intent,
            identity,
        ),
        packageSuitability:
            getPackageSuitability(
                intent,
                identity,
            ),
        retailerConsensus:
            getRetailerConsensus(group),
        availability: group.offers.some(
            (offer) => offer.available === true,
        )
            ? 1
            : 0,
        mismatchPenalty:
            getMismatchPenalty(intent, identity),
    };

    const score =
        scoreDetails.textMatch * 35 +
        scoreDetails.categoryMatch * 35 +
        scoreDetails.modifierMatch * 12 +
        scoreDetails.packageSuitability * 8 +
        scoreDetails.retailerConsensus * 7 +
        scoreDetails.availability * 3 -
        scoreDetails.mismatchPenalty;

    return {
        ...group,
        score,
        scoreDetails,
    };
}