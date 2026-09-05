export type IcaSearchResponse = {
    productGroups: {
        type: "featured" | "personalized";
        decoratedProducts: IcaProduct[];
    }[];
}

export type IcaProduct = {
    productId: string;
    retailerProductId: string;
    type: ProductType;

    externalAdvertId?: string;
    featuredProductCampaign?: FeaturedProductCampaign;

    name: string;
    brand: string;
    packSizeDescription: string | null;
    countryOfOrigin: string | null;

    price: Money;
    unitPrice: UnitPrice;

    available: boolean;
    isVerifiedPurchase: boolean;
    quantityInBasket: number;
    maxQuantityReached: boolean;

    taxCodesDisplayNames: string[];

    imageConfig: ImageConfig | null;
    image: ProductImage | null;
    images: ProductImage[];
    imageIds: string[];
    imagePaths: string[];

    iconAttributes: IconAttribute[];
    icons: Icon[];
    basketLines: BasketLine[];

    timeRestricted: boolean;
    alternatives: IcaProductAlternative[];

    isInShoppingList: boolean;
    isInCurrentCatalog: boolean;

    retailerFinancingPlanIds: string[];

    alcohol: boolean;
    categoryPath: string[];
    isNew: boolean;
};

type ProductType = "REGULAR" | string;

type Money = {
    amount: string;
    currency: string;
};

type UnitPrice = {
    price: Money;
    unit: string;
    unitName: string;
};

type FeaturedProductCampaign = {
    campaignId: string;
    campaignName: string;
    externalAdvertId: string;
    trackId: string;
    source: string;
    pricingModel: string;
};

type ImageConfig = {
    availableFormats: string[];
    availableResolutions: string[];
};

type ProductImage = {
    src: string;
    description: string | null;
    fopSrcset: string | null;
    bopSrcset: string | null;
    imageId: string;
};

type IconAttribute = {
    label: string;
    file: string;
};

/**
 * These arrays were empty in the example response,
 * so their exact structure cannot be inferred yet.
 */
type Icon = Record<string, unknown>;
type BasketLine = Record<string, unknown>;
export type IcaProductAlternative = Record<string, unknown>;