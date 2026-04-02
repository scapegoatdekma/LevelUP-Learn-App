const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

const buildUrl = (path, query = {}) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${API_BASE_URL}${normalizedPath}`);

    Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
            return;
        }

        url.searchParams.set(key, String(value));
    });

    return url.toString();
};

const parseJsonSafely = async (response) => {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

export class ApiError extends Error {
    constructor(message, status, details = null) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.details = details;
    }
}

const request = async (path, options = {}) => {
    const { method = "GET", query, body, signal } = options;
    // Один общий слой для всех запросов.
    // Компоненты не знают про fetch-детали и остаются аккуратными.

    const headers = {
        Accept: "application/json",
    };

    const fetchOptions = {
        method,
        headers,
        signal,
    };

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(buildUrl(path, query), fetchOptions);
    } catch {
        throw new ApiError("РЎРµС‚РµРІР°СЏ РѕС€РёР±РєР°. РџСЂРѕРІРµСЂСЊС‚Рµ, С‡С‚Рѕ Р±СЌРєРµРЅРґ Р·Р°РїСѓС‰РµРЅ.", 0);
    }

    const payload = await parseJsonSafely(response);

    if (!response.ok || payload?.success === false) {
        throw new ApiError(
            payload?.message || `РћС€РёР±РєР° Р·Р°РїСЂРѕСЃР°. РЎС‚Р°С‚СѓСЃ: ${response.status}`,
            response.status,
            payload?.error || null,
        );
    }

    return payload?.data ?? null;
};

export const apiClient = {
    get: (path, options = {}) => request(path, { ...options, method: "GET" }),
    post: (path, body, options = {}) =>
        request(path, { ...options, method: "POST", body }),
    put: (path, body, options = {}) =>
        request(path, { ...options, method: "PUT", body }),
    delete: (path, options = {}) =>
        request(path, { ...options, method: "DELETE" }),
};
