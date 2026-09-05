export function normalizeGtin(value: unknown): string | null {
    if (typeof value !== "string" && typeof value !== "number") {
        return null;
    }

    const digits = String(value).replace(/\D/g, "");

    if (digits.length < 8 || digits.length > 14) {
        return null;
    }

    const normalized = digits.padStart(14, "0");

    return hasValidGtinCheckDigit(normalized)
        ? normalized
        : null;
}

export function extractGtinFromText(
    value: string | null | undefined,
): string | null {
    if (!value) {
        return null;
    }

    const candidates = value.match(/\d{13,14}/g) ?? [];

    for (const candidate of candidates) {
        const gtin = normalizeGtin(candidate);

        if (gtin) {
            return gtin;
        }
    }

    return null;
}

function hasValidGtinCheckDigit(gtin: string): boolean {
    if (!/^\d{14}$/.test(gtin)) {
        return false;
    }

    const body = gtin.slice(0, -1);
    const suppliedCheckDigit = Number(
        gtin.charAt(gtin.length - 1),
    );

    const sum = [...body]
        .reverse()
        .reduce((total, digit, index) => {
            const multiplier = index % 2 === 0 ? 3 : 1;

            return total + Number(digit) * multiplier;
        }, 0);

    const calculatedCheckDigit = (10 - (sum % 10)) % 10;

    return suppliedCheckDigit === calculatedCheckDigit;
}