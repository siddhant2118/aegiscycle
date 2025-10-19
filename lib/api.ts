
// This is a placeholder for the actual environment variable.
// In a real Next.js app, this would be process.env.NEXT_PUBLIC_API_URL
const API_BASE = undefined; // Set to a URL string to test live mode

export const getApiBase = () => API_BASE;

export const postJSON = async <T,>(path: string, body: object): Promise<T> => {
    if (!API_BASE) {
        throw new Error("API base URL not set. Cannot make live API calls.");
    }

    const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network request failed: ${response.status} ${errorText}`);
    }

    return response.json();
};
