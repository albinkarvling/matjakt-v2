type CoopPriceData = {
    b2cPrice: number;
    b2bPrice: number;
};

type CoopComparativePriceUnit = {
    unit: string;
    text: string;
};

export type CoopProduct = {
    id: string;
    type: "Product";
    ean: string;
    name: string;
    manufacturerName: string;
    packageSize: number;
    packageSizeInformation: string;
    packageSizeUnit: string;
    salesPriceData: CoopPriceData;
    comparativePriceData: CoopPriceData;
    comparativePriceUnit: CoopComparativePriceUnit;
    comparativePriceText: string;
    availableOnline: boolean;
    imageUrl: string;
};

export type CoopSearchResponse = {
    queryUsed: string;
    results: {
        count: number;
        facets: unknown[];
        items: CoopProduct[];
    };
};