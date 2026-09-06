import { useState } from "react";
import { twMerge } from "tailwind-merge";
import type { ProductFilter } from "../../../types/product";

const DEFAULT_SHOWN_COUNT = 3;

type Props = {
    filters: ProductFilter[];
    selectedValue: string;
    onChange: (value: string) => void;
};

export const ProductFilters = ({ filters, selectedValue, onChange }: Props) => {
    const [expandedFilters, setExpandedFilters] = useState<string[]>([]);

    const toggleValue = (value: string) => {
        if (selectedValue === value) {
            onChange("");

            return;
        }

        onChange(value);
    };

    if (filters.length === 0) {
        return null;
    }

    return (
        <div className="mb-5 flex flex-col gap-2">
            {filters.map((filter) => (
                <fieldset key={filter.id}>
                    <legend className="font-semibold text-text-primary">{filter.label}</legend>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {filter.options
                            .slice(
                                0,
                                expandedFilters.includes(filter.id)
                                    ? filter.options.length
                                    : DEFAULT_SHOWN_COUNT,
                            )
                            .map((option) => {
                                const checked = selectedValue === option.value;

                                return (
                                    <button
                                        type="button"
                                        key={option.label}
                                        onClick={() => toggleValue(option.value)}
                                        className={twMerge(
                                            "px-3 py-1 rounded-lg border border-bg-tertiary bg-bg-secondary cursor-pointer",
                                            checked && "bg-bg-tertiary",
                                        )}
                                    >
                                        {option.label} ({option.count})
                                    </button>
                                );
                            })}
                        {filter.options.length > DEFAULT_SHOWN_COUNT && (
                            <button
                                type="button"
                                onClick={() =>
                                    setExpandedFilters((prev) =>
                                        prev.includes(filter.id)
                                            ? prev.filter((id) => id !== filter.id)
                                            : [...prev, filter.id],
                                    )
                                }
                                className="px-3 py-1 cursor-pointer"
                            >
                                {expandedFilters.includes(filter.id) ? "Visa färre" : "Visa fler"}
                            </button>
                        )}
                    </div>
                </fieldset>
            ))}
        </div>
    );
};
