export type CityGrossSearchResponse = {
    searchResults: {
        products: CityGrossApiProduct[];
    };
};

export type CityGrossApiProduct = {
    id: string;
    gtin: string | null;

    name: string;
    brand: string | null;
    descriptiveSize: string | null;
    sellable?: boolean;
    images: CityGrossImage[];

    productStoreDetails: {
        prices: {
            currentPrice: CityGrossPrice;
        };
    };
};

type CityGrossImage = {
    url: string;
    alt: string;
    type: number;
};

type CityGrossPrice = {
    price: number;
    unit: string | null;
    comparativePrice: number | null;
    comparativePriceUnit: string | null;
};