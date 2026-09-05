const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export const baseFetch = async <T>(url: string, options?: RequestInit): Promise<T> => {
    let response: Response | undefined;

    try {
        const headers = new Headers(options?.headers);

        // if no content-type is provided default to application/json
        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }

        response = await fetch(`${API_ENDPOINT}${url}`, {
            ...options,
            headers,
        });
    } catch (error) {
        console.error(`Error fetching ${url}:`, error);
        throw error;
    }

    if (!response) {
        console.error(`No response received for ${url}`);
        throw new Error(`No response received for ${url}`);
    }

    const text = await response.text();

    if (!text) {
        throw new Error(`Empty response received for ${url}`);
    }

    // try to parse as JSON first
    try {
        return JSON.parse(text) as T;
    } catch {
        // if JSON parsing fails, check if it's a simple string (like a URL)
        // return the string as-is if it doesn't start with invalid JSON characters
        if (typeof text === "string" && !text.startsWith("{") && !text.startsWith("[")) {
            return text as T;
        }
        throw new Error(`Invalid response format: ${text}`);
    }
};
