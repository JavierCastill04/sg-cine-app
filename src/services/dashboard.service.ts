
import { api } from './api';

export interface IngresosPorCineAPI {
    cineId: number;
    cine: string;
    ingresos: number;
}

export interface PeliculaMasReservadaAPI {
    peliculaId: number;
    pelicula: string;
    boletosVendidos: number;
}

export interface DashboardResponse {
    peliculas: {
        total: number;
    };

    funciones: {
        total: number;
        activas: number;
        canceladas: number;
    };

    boletosVendidos: number;

    asientos: {
        capacidadTotal: number;
        ocupados: number;
        disponibles: number;
    };

    ingresosTotales: number;

    ingresosPorCine: IngresosPorCineAPI[];

    peliculaMasReservada: PeliculaMasReservadaAPI | null;
}

export const dashboardService = {
    obtenerDashboard: () =>
        api.get<DashboardResponse>('/dashboard', true),
};
