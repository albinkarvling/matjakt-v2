import { CheckCircleOutlined } from "@mui/icons-material";
import type { ProductGroup } from "../../../types/product";
import { readableRetailerName } from "../../../utils/readableRetailerName";

type Props = {
    group: ProductGroup;
};
export const SearchResult = ({ group }: Props) => {
    const { canonicalProduct: product, offers } = group;

    const cheapestOffer = offers.at(0);
    return (
        <div
            className="p-5 flex gap-5 bg-bg-secondary border border-bg-tertiary rounded-lg"
            key={group.key}
        >
            <div className="w-38 max-h-38 aspect-square grid place-items-center border-2 border-bg-tertiary rounded-lg overflow-hidden">
                {product.imageUrl && (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-xl font-medium">{product.name}</h2>
                        <div className="mt-0.5 flex gap-1">
                            <span className="text-text-secondary">{product.brand}</span>·
                            <span className="text-text-secondary">{product.packageSize}</span>
                        </div>
                    </div>
                    <div className="flex items-end flex-col">
                        <span className="text-text-secondary">Lägsta pris</span>
                        <span className="text-2xl font-bold">{cheapestOffer?.price.amount} kr</span>
                        <span className="text-sm text-text-secondary">
                            {cheapestOffer?.unitPrice?.price.amount} kr/
                            {cheapestOffer?.unitPrice?.unitName}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-brand-secondary">
                    <CheckCircleOutlined sx={{ fontSize: "1.25rem" }} />
                    Billigast hos {readableRetailerName(cheapestOffer?.retailer)}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    {offers.map((offer) => (
                        <div
                            className="p-2 flex items-center gap-2 bg-bg-tertiary rounded-lg"
                            key={offer.retailer}
                        >
                            <img
                                className="w-18"
                                src={`/retailers/${offer.retailer}.svg`}
                                alt={offer.retailer}
                            />
                            {offer.price.amount} kr
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
