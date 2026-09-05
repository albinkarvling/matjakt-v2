export function normalizeText(value: string): string {
    return value
        .toLocaleLowerCase("sv-SE")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[®™]/g, "")
        .replace(/,/g, ".")
        .replace(/&/g, " och ")
        .replace(/[^a-z0-9.%]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}