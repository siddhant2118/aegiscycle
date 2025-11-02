
import { API_BASE, API_KEY } from './config.local';

const sanitizedApiBase = API_BASE?.trim() || undefined;

export const getApiBase = () => sanitizedApiBase;

export const postJSON = async <T,>(path: string, body: object): Promise<T> => {
    if (!sanitizedApiBase) {
        throw new Error("API base URL not set. Cannot make live API calls.");
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (API_KEY?.trim()) {
        headers['Authorization'] = `Bearer ${API_KEY.trim()}`;
    }

    const response = await fetch(`${sanitizedApiBase}${path}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network request failed: ${response.status} ${errorText}`);
    }

    return response.json();
};
