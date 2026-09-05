import { CheckCircleOutlined } from "@mui/icons-material";
import { useState } from "react";
import type { ProductGroup } from "../../../types/product";
import { readableRetailerName } from "../../../utils/readableRetailerName";

type Props = {
    group: ProductGroup;
};
export const SearchResult = ({ group }: Props) => {
    const { canonicalProduct: product, offers } = group;

    const [expanded, setExpanded] = useState(false);

    const cheapestOffer = offers.at(0);
    return (
        <div className="p-5 bg-bg-secondary border border-bg-tertiary rounded-lg" key={group.key}>
            <div className="flex gap-3">
                <div className="w-28 max-h-28 aspect-square grid place-items-center border-2 border-bg-tertiary rounded-lg overflow-hidden">
                    {product.imageUrl && (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex-1 flex justify-between">
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-medium">{product.name}</h2>
                                <div className="mt-0.5 flex gap-1">
                                    <span className="text-text-secondary">{product.brand}</span>·
                                    <span className="text-text-secondary">
                                        {product.packageSize}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 text-brand-secondary">
                                <CheckCircleOutlined sx={{ fontSize: "1.25rem" }} />
                                Billgast hos {readableRetailerName(cheapestOffer?.retailer)}
                            </div>
                        </div>
                        <div className="flex items-end flex-col">
                            <span className="text-text-secondary">Lägsta pris</span>
                            <span className="text-2xl font-bold">
                                {cheapestOffer?.price.amount} kr
                            </span>
                            <span className="text-sm text-text-secondary">
                                {cheapestOffer?.unitPrice?.price.amount} kr/
                                {cheapestOffer?.unitPrice?.unitName}
                            </span>
                            <button
                                className="mt-3 cursor-pointer"
                                type="button"
                                onClick={() => setExpanded(!expanded)}
                            >
                                {!expanded ? `Jämför ${offers.length} priser` : `Dölj priser`}
                            </button>
                        </div>
                    </div>
                    {expanded && (
                        <div className="mt-4 flex flex-col">
                            {offers.map((offer) => (
                                <div
                                    key={offer.retailer}
                                    className="py-2 last:pb-0 flex justify-between border-t border-t-bg-tertiary"
                                >
                                    <span>{readableRetailerName(offer.retailer)}</span>
                                    <span>{offer.price.amount} kr</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
