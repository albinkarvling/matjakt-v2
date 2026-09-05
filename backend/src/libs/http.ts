export const BROWSER_USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
    "AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/150.0.0.0 Safari/537.36";

const DEFAULT_TIMEOUT_MS = 15_000;

export interface FetchJsonOptions extends RequestInit {
    timeoutMs?: number;
}

export class HttpError extends Error {
    public readonly status: number;
    public readonly statusText: string;
    public readonly url: string;
    public readonly responseBody: string | null;

    public constructor(input: {
        status: number;
        statusText: string;
        url: string;
        responseBody?: string | null;
    }) {
        super(
            `HTTP ${input.status} ${input.statusText} when requesting ${input.url}`,
        );

        this.name = "HttpError";
        this.status = input.status;
        this.statusText = input.statusText;
        this.url = input.url;
        this.responseBody = input.responseBody ?? null;
    }
}

export async function fetchJson<T = unknown>(
    url: string,
    options: FetchJsonOptions = {},
): Promise<T> {
    const {
        timeoutMs = DEFAULT_TIMEOUT_MS,
        headers,
        signal: externalSignal,
        ...requestOptions
    } = options;

    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => {
        timeoutController.abort(
            new Error(`Request timed out after ${timeoutMs} ms`),
        );
    }, timeoutMs);

    try {
        const response = await fetch(url, {
            ...requestOptions,
            headers: {
                accept: "application/json",
                "user-agent": BROWSER_USER_AGENT,
                ...headers,
            },
        });

        const responseText = await response.text();

        if (!response.ok) {
            throw new HttpError({
                status: response.status,
                statusText: response.statusText,
                url: response.url || url,
                responseBody: responseText || null,
            });
        }

        if (!responseText.trim()) {
            throw new Error(`Expected JSON response from ${url}, but body was empty`);
        }

        try {
            return JSON.parse(responseText) as T;
        } catch (error) {
            console.error(`Failed to parse JSON response from ${url}:`, error);
            throw new Error(`Invalid JSON response from ${url}`);
        }
    } catch (error) {
        if (
            timeoutController.signal.aborted &&
            !externalSignal?.aborted
        ) {
            throw new Error(
                `Request to ${url} timed out after ${timeoutMs} ms`
            );
        }

        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}