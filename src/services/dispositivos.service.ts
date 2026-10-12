
import { api } from './api';

interface DispositivoResponse {
    message: string;
}

const BASE_URL = '/dispositivos';

export const dispositivosService = {
    registrar: (expoPushToken: string): Promise<DispositivoResponse> =>
        api.post<DispositivoResponse>(
            BASE_URL,
            {
                expo_push_token: expoPushToken,
            },
            true
        ),

    eliminar: (expoPushToken: string): Promise<DispositivoResponse> =>
        api.delete<DispositivoResponse>(
            `${BASE_URL}/${encodeURIComponent(expoPushToken)}`,
            true
        ),
};
