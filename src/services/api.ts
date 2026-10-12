import { obtenerToken } from './secureStorage';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://sgcine.up.railway.app';

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(status: number, data: unknown) {
        const message =
            typeof data === 'string'
                ? data
                : data && typeof data === 'object' && 'message' in data
                    ? String(data.message)
                    : `Error HTTP ${status}`;

        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

const request = async <T>(
    method: string,
    url: string,
    body?: unknown,
    requiereAuth = false
): Promise<T> => {
    const token = requiereAuth
        ? await obtenerToken()
        : null;

    if (requiereAuth && !token) {
        throw new Error(
            'Debes iniciar sesión para realizar esta operación.'
        );
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let response: Response;

    try {
        response = await fetch(`${API_URL}${url}`, {
            method,
            headers,
            body: body !== undefined
                ? JSON.stringify(body)
                : undefined,
        });
    } catch {
        throw new Error(
            'No se pudo conectar con la API. Comprueba tu conexión a Internet e inténtalo nuevamente.'
        );
    }

    const text = await response.text();
    let data: unknown = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        throw new ApiError(response.status, data);
    }

    return data as T;
};

export const api = {
    get: <T>(url: string, requiereAuth = false) =>
        request<T>('GET', url, undefined, requiereAuth),

    post: <T>(url: string, data: unknown, requiereAuth = false) =>
        request<T>('POST', url, data, requiereAuth),

    put: <T>(url: string, data: unknown, requiereAuth = false) =>
        request<T>('PUT', url, data, requiereAuth),

    patch: <T>(url: string, data: unknown, requiereAuth = false) =>
        request<T>('PATCH', url, data, requiereAuth),

    delete: <T = void>(url: string, requiereAuth = false) =>
        request<T>('DELETE', url, undefined, requiereAuth),
};