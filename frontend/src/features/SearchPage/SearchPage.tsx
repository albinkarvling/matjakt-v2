import { ArrowForward, Search } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { baseFetch } from "../../api/baseFetch";
import { Button } from "../../components/Button/Button";
import { TextField } from "../../components/TextField/TextField";
import type { ProductFilter, ProductGroup, SearchProductResponse } from "../../types/product";
import { ProductFilters } from "./ProductFilters/ProductFilters";
import { SearchResult } from "./SearchResult/SearchResult";

export const SearchPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const query = searchParams.get("q") ?? "";

    const [localQuery, setLocalQuery] = useState(query);
    const [groups, setGroups] = useState<ProductGroup[]>([]);
    const [filters, setFilters] = useState<ProductFilter[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string[]>([]);

    useEffect(() => {
        if (!query) return;

        const fetchData = async () => {
            setLocalQuery(query);
            setSelectedFilter([]);
            setGroups([]);
            setFilters([]);

            const response = await baseFetch<SearchProductResponse>(
                `/products?q=${encodeURIComponent(query)}`,
            );

            setGroups(response.groups);
            setFilters(response.filters);
        };

        fetchData();
    }, [query]);

    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault();

        if (!localQuery) return;

        setLocalQuery(localQuery);
        setSelectedFilter([]);
        setGroups([]);
        setFilters([]);

        navigate(`/search?q=${localQuery}`);
    };

    const visibleGroups = useMemo(() => {
        if (selectedFilter.length === 0) {
            return groups;
        }

        return groups.filter((group) => {
            const quantity = group.canonicalProduct.identity.quantity;

            if (!quantity) {
                return false;
            }

            const filterValue = `${quantity.unit}:${quantity.value}`;

            return selectedFilter.includes(filterValue);
        });
    }, [groups, selectedFilter]);

    return (
        <main className="min-h-screen bg-bg-primary">
            <div className="border-b border-b-bg-tertiary py-12">
                <h1 className="text-center text-3xl">Vad vill du jämföra?</h1>

                <p className="mt-1 text-center">
                    Jämför samma produkt från olika butiker, alltid med bästa pris.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto mt-5 flex w-132 items-center gap-3"
                >
                    <TextField
                        startItem={<Search />}
                        label="Sök efter mjölk, nötfärs, etc"
                        value={localQuery}
                        onChange={setLocalQuery}
                        className="flex-1"
                    />

                    <Button endItem={<ArrowForward />} type="submit">
                        Jämför
                    </Button>
                </form>
            </div>

            <div className="mx-auto w-260 py-12">
                <ProductFilters
                    filters={filters}
                    selectedValue={selectedFilter[0] ?? ""}
                    onChange={(value) => setSelectedFilter(value ? [value] : [])}
                />

                <div className="flex min-w-0 flex-1 flex-col gap-5">
                    {visibleGroups.map((group) => (
                        <SearchResult group={group} key={group.key} />
                    ))}

                    {groups.length > 0 && visibleGroups.length === 0 && (
                        <p className="text-text-secondary">
                            Inga produkter matchar de valda filtren.
                        </p>
                    )}
                </div>
            </div>
        </main>
    );
};
