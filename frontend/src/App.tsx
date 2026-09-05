import { useState } from "react";
import "./App.css";
import { ArrowForward, CheckCircleOutlined, Search } from "@mui/icons-material";
import { baseFetch } from "./api/baseFetch";
import { Button } from "./components/Button/Button";
import { TextField } from "./components/TextField/TextField";
import type { ProductGroup } from "./types/product";
import { readableRetailerName } from "./utils/readableRetailerName";

function App() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<ProductGroup[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await baseFetch<{ groups: ProductGroup[] }>(`/products?q=${query}`);
        setResult(response.groups);
    };

    return (
        <div className="bg-bg-primary min-h-screen">
            <div className="py-12 border-b border-b-bg-tertiary">
                <h1 className="text-3xl text-center">Vad vill du jämföra?</h1>
                <p className="mt-1 text-center">
                    Jämför samma produkt från olika butiker, alltid med bästa pris.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="w-132 mt-5 mx-auto flex items-center gap-3"
                >
                    <TextField
                        startItem={<Search />}
                        label="Sök efter mjölk, nötfärs, etc"
                        value={query}
                        onChange={setQuery}
                        className="flex-1"
                    />
                    <Button endItem={<ArrowForward />} type="submit">
                        Jämför
                    </Button>
                </form>
            </div>
            <div className="w-212 mx-auto py-12">
                <div className="flex flex-col gap-5">
                    {result.length !== 0 &&
                        result.map((group) => {
                            const { canonicalProduct: product, offers } = group;

                            const cheapestOffer = offers.at(0);
                            return (
                                <div
                                    className="p-5 bg-bg-secondary border border-bg-tertiary rounded-lg"
                                    key={group.key}
                                >
                                    <div className="flex gap-3">
                                        <div className="w-28 aspect-square grid place-items-center border-2 border-bg-tertiary rounded-lg overflow-hidden">
                                            {product.imageUrl && (
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 flex justify-between">
                                            <div className="flex flex-col justify-between">
                                                <div>
                                                    <h2 className="text-xl font-medium">
                                                        {product.name}
                                                    </h2>
                                                    <div className="mt-0.5 flex gap-1">
                                                        <span className="text-text-secondary">
                                                            {product.brand}
                                                        </span>
                                                        ·
                                                        <span className="text-text-secondary">
                                                            {product.packageSize}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 text-brand-secondary">
                                                    <CheckCircleOutlined
                                                        sx={{ fontSize: "1.25rem" }}
                                                    />
                                                    Billgast hos{" "}
                                                    {readableRetailerName(cheapestOffer?.retailer)}
                                                </div>
                                            </div>
                                            <div className="flex items-end flex-col">
                                                <span className="text-text-secondary">
                                                    Lägsta pris
                                                </span>
                                                <span className="text-2xl font-bold">
                                                    {cheapestOffer?.price.amount} kr
                                                </span>
                                                <span className="text-sm text-text-secondary">
                                                    {cheapestOffer?.unitPrice?.price.amount} kr/
                                                    {cheapestOffer?.unitPrice?.unitName}
                                                </span>
                                                <button
                                                    className="mt-auto cursor-pointer"
                                                    type="button"
                                                >
                                                    Jämför {offers.length} priser
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default App;
