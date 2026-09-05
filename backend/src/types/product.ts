export type Retailer =
    | "ica"
    | "coop"
    | "willys"
    | "hemkop"
    | "cityGross"
    | "lidl";

export type Money = {
    amount: string;
    currency: "SEK";
}

export type UnitPrice = {
    price: Money;
    unit: string;
    unitName: string;
}

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

    imageUrl: string | null;
    available: boolean | null;
}