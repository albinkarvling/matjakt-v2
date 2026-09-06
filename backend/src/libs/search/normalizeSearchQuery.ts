export function normalizeSearchQuery(query: string) {
    return query.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("sv-SE");
}
