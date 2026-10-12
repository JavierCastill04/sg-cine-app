
import { api } from './api';

export interface CrearReservaRequest {
    funcionId: number;
    asientos: string[];
}

export interface ReservaAPI {
    id: number;
    codigo: string;
    funcionId: number;
    total: string | number;
    estado: 'activa' | 'utilizada' | 'cancelada';
    asientos: string[];
    pelicula?: string;
    fechaHora?: string;
    sala?: string;
    cine?: string;
}

export interface CrearReservaResponse {
    message: string;
    reserva: ReservaAPI;
}

export interface ValidarReservaResponse {
    message: string;
    codigo: string;
    estado: 'utilizada';
}

export const reservasService = {
    crear: (datos: CrearReservaRequest) =>
        api.post<CrearReservaResponse>('/reservas', datos, true),

    misReservas: () =>
        api.get<ReservaAPI[]>('/reservas/misReservas', true),

    validar: (codigo: string) =>
        api.patch<ValidarReservaResponse>(
            `/reservas/${encodeURIComponent(codigo)}/validar`,
            {},
            true
        ),
};