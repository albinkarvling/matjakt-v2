import React from "react";

type Props = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    className?: string;
    startItem?: React.ReactNode;
};

export const TextField = ({ startItem, value, onChange, label, className }: Props) => {
    const inputId = React.useId();

    return (
        <div className={`relative ${className ?? ""}`}>
            <input
                id={inputId}
                className={`peer w-full border rounded-md border-bg-tertiary bg-bg-secondary ${startItem ? "pl-10" : ""} px-3 py-2`}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder=" "
            />
            {startItem && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
                    {startItem}
                </div>
            )}

            {label && (
                <label
                    htmlFor={inputId}
                    className={`
                        pointer-events-none absolute ${startItem ? "left-10" : "left-3"} top-0
                        -translate-y-1/2 px-1
                        text-xs transition-all
                        peer-placeholder-shown:top-1/2
                        peer-placeholder-shown:-translate-y-1/2
                        peer-placeholder-shown:bg-transparent
                        peer-placeholder-shown:text-base
                        peer-placeholder-shown:opacity-50
                        after:content-['']
                        after:bg-bg-secondary
                        after:h-1
                        after:absolute
                        after:top-[calc(50%+1px)]
                        after:-z-1
                        after:-translate-y-2/4
                        after:w-full
                        after:left-0
                    `}
                >
                    {label}
                </label>
            )}
        </div>
    );
};
