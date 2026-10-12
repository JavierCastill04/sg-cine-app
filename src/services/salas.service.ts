
import { api } from './api';
import type { Sala as SalaLocal } from '../types/Sala';

export interface SalaApi {
    id: number;
    cine_id: number;
    nombre: string;
    filas: number;
    columnas: number;
}

export interface CrearSalaRequest {
    cine_id: number;
    nombre: string;
    filas: number;
    columnas: number;
}

export interface CrearSalaResponse {
    message: string;
    sala: SalaApi;
}

export interface ActualizarSalaResponse {
    message: string;
    sala?: SalaApi;
}

export interface EliminarSalaResponse {
    message: string;
}

const BASE_URL = '/salas';

export const convertirSala = (sala: SalaApi): SalaLocal => ({
    id: sala.id,
    cineId: sala.cine_id,
    nombre: sala.nombre,
    capacidad: {
        filas: sala.filas,
        columnas: sala.columnas,
    },
    asientos: [],
});

export const salasService = {
    listar: async (cineId?: number): Promise<SalaLocal[]> => {
        const url = cineId !== undefined
            ? `${BASE_URL}?cine_id=${cineId}`
            : BASE_URL;

        const salas = await api.get<SalaApi[]>(url);
        return salas.map(convertirSala);
    },

    obtenerPorId: async (id: number): Promise<SalaLocal> => {
        const sala = await api.get<SalaApi>(`${BASE_URL}/${id}`);
        return convertirSala(sala);
    },

    crear: (datos: CrearSalaRequest) =>
        api.post<CrearSalaResponse>(BASE_URL, datos, true),

    actualizar: (
        id: number,
        datos: CrearSalaRequest,
    ) =>
        api.put<ActualizarSalaResponse>(
            `${BASE_URL}/${id}`,
            datos,
            true,
        ),

    eliminar: (id: number) =>
        api.delete<EliminarSalaResponse>(
            `${BASE_URL}/${id}`,
            true,
        ),
};