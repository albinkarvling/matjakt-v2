import { ArrowForward, Search } from "@mui/icons-material";
import { useState } from "react";
import { baseFetch } from "../../api/baseFetch";
import { Button } from "../../components/Button/Button";
import { TextField } from "../../components/TextField/TextField";
import type { ProductGroup } from "../../types/product";
import { SearchResult } from "./SearchResult/SearchResult";

export const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<ProductGroup[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await baseFetch<{ groups: ProductGroup[] }>(`/products?q=${query}`);
        setResult(response.groups);
    };

    return (
        <main className="bg-bg-primary min-h-screen">
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
                        result.map((group) => <SearchResult group={group} key={group.key} />)}
                </div>
            </div>
        </main>
    );
};
