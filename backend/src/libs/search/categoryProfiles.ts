import type {
    ProductCategory,
} from "../../types/product.ts";

export type CategoryProfile = {
    category: ProductCategory;
    queryAliases: readonly string[];

    categoryScores: Partial<
        Record<ProductCategory, number>
    >;

    negativeTerms: readonly {
        term: string;
        penalty: number;
    }[];

    preferredQuantity: {
        unit: "ml" | "g";
        min: number;
        max: number;
    } | null;
};

export const CATEGORY_PROFILES:
    readonly CategoryProfile[] = [
        {
            category: "ground-beef",
            queryAliases: [
                "notfars",
                "not fars",
                "malet notkott",
            ],
            categoryScores: {
                "ground-beef": 1,
                "mixed-mince": 0.3,
                "other-mince": 0.1,
                "prepared-food": 0,
                "pet-food": 0,
                other: 0,
            },
            negativeTerms: [
                {
                    term: "kattmat",
                    penalty: 100,
                },
                {
                    term: "hundmat",
                    penalty: 100,
                },
                {
                    term: "bitar i gele",
                    penalty: 100,
                },
                {
                    term: "bitar i sas",
                    penalty: 100,
                },
                {
                    term: "burek",
                    penalty: 80,
                },
                {
                    term: "blandfars",
                    penalty: 35,
                },
                {
                    term: "kycklingfars",
                    penalty: 70,
                },
                {
                    term: "kalvfars",
                    penalty: 60,
                },
                {
                    term: "not och gront",
                    penalty: 45,
                },
            ],
            preferredQuantity: {
                unit: "g",
                min: 400,
                max: 1200,
            },
        },
        {
            category: "milk",
            queryAliases: ["mjolk"],
            categoryScores: {
                milk: 1,
                "plant-drink": 0.45,
                kvarg: 0,
                "coffee-drink": 0,
                "pet-food": 0,
                other: 0,
            },
            negativeTerms: [
                {
                    term: "kattmat",
                    penalty: 100,
                },
                {
                    term: "kvarg",
                    penalty: 70,
                },
                {
                    term: "kaffekoncentrat",
                    penalty: 80,
                },
            ],
            preferredQuantity: {
                unit: "ml",
                min: 1000,
                max: 2000,
            },
        },
    ];