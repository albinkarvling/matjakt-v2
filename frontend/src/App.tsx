import { useState } from "react";
import "./App.css";
import { baseFetch } from "./api/baseFetch";
import type { ProductGroup } from "./types/product";

function App() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<ProductGroup[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await baseFetch<{ groups: ProductGroup[] }>(`/products?q=${query}`);
        setResult(response.groups);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                enter query
                <input value={query} onChange={(e) => setQuery(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {result.length !== 0 &&
                    result.map((group) => (
                        <div key={group.key}>
                            {group.offers.map((item) => (
                                <div key={item.retailerProductId}>
                                    <p>{item.name}</p>
                                    <p>
                                        {item.price.amount} {item.price.currency}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default App;
