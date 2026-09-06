export type Retailer = "ica" | "coop" | "willys" | "hemkop" | "cityGross" | "lidl";

export type Money = {
    amount: string;
    currency: "SEK";
};

export type UnitPrice = {
    price: Money;
    unit: string;
    unitName: string;
};

export type PriceBasis = "item" | "kilogram" | "liter" | "unknown";

export type Product = {
    retailer: Retailer;
    retailerProductId: string;

    gtin: string | null;
    gtinSource: "image-url" | "retailer-api" | null;

    name: string;
    brand: string | null;
    packageSize: string | null;

    price: Money;
    unitPrice: UnitPrice | null;
    priceBasis: PriceBasis;

    imageUrl: string | null;
    available: boolean | null;
};

export type ProductCategory =
    | "milk"
    | "plant-drink"
    | "ground-beef"
    | "mixed-mince"
    | "other-mince"
    | "prepared-food"
    | "pet-food"
    | "kvarg"
    | "coffee-drink"
    | "other";

export type NormalizedQuantity = {
    value: number;
    unit: "ml" | "g";
    approximate: boolean;
};

export type ProductIdentity = {
    normalizedName: string;
    normalizedBrand: string | null;
    category: ProductCategory;
    quantity: NormalizedQuantity | null;
    fatPercent: number | null;
    organic: boolean;
    lactoseFree: boolean;
    frozen: boolean;
    country: string | null;
};

export type SearchProduct = Product & {
    /**
     * Zero-based position in the retailer's original response.
     */
    retailerRank: number;
    identity: ProductIdentity;
};

export type ProductScoreDetails = {
    textMatch: number;
    categoryMatch: number;
    modifierMatch: number;
    packageSuitability: number;
    retailerRelevance: number;
    availability: number;
    mismatchPenalty: number;
};

export type ProductFilterOption = {
    value: string;
    label: string;
    count: number;
};

export type ProductFilter = {
    id: "quantity";
    label: string;
    options: ProductFilterOption[];
};

export type ProductGroup = {
    key: string;
    gtin: string | null;
    canonicalProduct: SearchProduct;
    offers: SearchProduct[];
    score: number;
    scoreDetails: ProductScoreDetails;
};

export type SearchProductResponse = {
    groups: ProductGroup[];
    filters: ProductFilter[];
};
