type Props = {
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    endItem?: React.ReactNode;
    children: React.ReactNode;
};

export const Button = ({ children, onClick, type = "button", endItem }: Props) => {
    return (
        <button
            onClick={onClick}
            type={type}
            className="px-4 py-2.5 rounded-lg text-sm font-medium bg-brand-primary text-text-white hover:bg-brand-secondary transition-colors cursor-pointer flex items-center"
        >
            {children}
            {endItem && <span className="ml-2">{endItem}</span>}
        </button>
    );
};
