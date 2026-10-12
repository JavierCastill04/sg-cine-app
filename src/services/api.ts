
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://sgcine.up.railway.app';

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
  body?: unknown
): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${url}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      'No se pudo conectar con la API. Comprueba que el servidor esté encendido y que ambos dispositivos estén en la misma red.'
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
  get: <T>(url: string) => request<T>('GET', url),

  post: <T>(url: string, data: unknown) =>
    request<T>('POST', url, data),

  put: <T>(url: string, data: unknown) =>
    request<T>('PUT', url, data),

  patch: <T>(url: string, data: unknown) =>
    request<T>('PATCH', url, data),

  delete: <T = void>(url: string) =>
    request<T>('DELETE', url),
};
