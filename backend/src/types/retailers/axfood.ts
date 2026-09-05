export type WillysSearchResponse = {
    results: WillysApiProduct[];
};

export type WillysApiProduct = {
    potentialPromotions: WillysPromotion[];
    inactivePotentialPromotions: WillysPromotion[];

    newsSplashProduct: boolean;
    notAllowedAnonymous: boolean;
    notAllowedB2b: boolean;
    gdprTrackingIncompliant: boolean;

    pickupProductLine2: string;
    productLine2: string;
    googleAnalyticsCategory: string;

    savingsAmount: number | null;

    priceNoUnit: string;
    priceUnit: string;
    price: string;
    priceValue: number;

    comparePrice: string;
    comparePriceUnit: string;

    depositPrice: string;
    averageWeight: number | null;

    nicotineMedicalProduct: boolean;
    tobaccoProduct: boolean;
    tobaccoFreeNicotineProduct: boolean;
    isDrugProduct: boolean;

    nonEkoProduct: boolean;
    showGoodPriceIcon: boolean;
    bargainProduct: boolean;

    hazards: WillysHazard[];
    precautionaryStatements: WillysPrecautionaryStatement[];
    energyDeclaration: WillysEnergyDeclaration | null;

    image: WillysImage | null;
    thumbnail: WillysImage | null;

    labels: string[];

    manufacturer: string | null;
    displayVolume: string;

    online: boolean;
    outOfStock: boolean;
    addToCartDisabled: boolean;
    addToCartMessage: string;

    incrementValue: number;

    code: string;
    name: string;

    ranking: number | null;
    solrSearchScore: number | null;

    seoDescription: string;
    seoTitle: string;

    productBasketType: WillysProductBasketType;
};

export type WillysImage = {
    imageType: string;
    format: string;
    url: string;
    altText: string | null;
    galleryIndex: number | null;
    width: number | null;
};

export type WillysProductBasketType = {
    code: string;
    type: string;
};

export type WillysPromotion = {
    promotionRedeemLimit: number | null;
    promotionPercentage: number | null;

    conditionLabelFormatted: string;
    cartLabelFormatted: string;
    redeemLimitLabel: string;
    comparePrice: string;

    code: string;
    threshold: number | null;

    price: WillysPrice;

    productCodes: string[] | null;

    applied: boolean;
    promotionType: string;
    campaignType: string;

    textLabelGenerated: string;
    textLabelManual: string | null;
    textLabel: string;

    offerStatus: string | null;

    promotionTheme: WillysPromotionTheme;

    lowestHistoricalPrice: WillysPrice | null;

    realMixAndMatch: boolean;
    mainProductCode: string;

    splashTitleText: string;

    timesUsed: number | null;
    qualifyingCount: number | null;

    cartLabel: string | null;

    /**
     * Unix timestamp in milliseconds.
     */
    validUntil: number;

    conditionLabel: string;
    rewardLabel: string;

    priority: number;
};

export type WillysPrice = {
    currencyIso: string;
    value: number;
    priceType: string;
    formattedValue: string;

    minQuantity: number | null;
    maxQuantity: number | null;
    sapUnit: string | null;
};

export type WillysPromotionTheme = {
    code: string;
    visible: boolean | null;
};

export type WillysHazard = Record<string, unknown>;
export type WillysPrecautionaryStatement = Record<string, unknown>;
export type WillysEnergyDeclaration = Record<string, unknown>;