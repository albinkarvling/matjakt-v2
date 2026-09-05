export const readableRetailerName = (retailer?: string) => {
    if (!retailer) return "";

    switch (retailer) {
        case "ica":
            return "ICA";
        case "coop":
            return "Coop";
        case "willys":
            return "Willys";
        case "hemkop":
            return "Hemköp";
        case "cityGross":
            return "City Gross";
        default:
            return retailer;
    }
};
