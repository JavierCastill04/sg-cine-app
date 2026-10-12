
import { api } from './api';

export interface Funcion {
    id: number;
    peliculaId: number;
    salaId: number;
    fechaHora: string;
    estado: 'activa' | 'cancelada';
    pelicula: string;
    duracion: number;
    clasificacion: string;
    sala: string;
    cineId: number;
    cine: string;
    direccion: string;
}

export interface Asiento {
    asiento: string;
    estado: 'libre' | 'ocupado';
}

export interface AsientosFuncion {
    funcionId: number;
    estado: 'activa' | 'cancelada';
    sala: string;
    filas: number;
    columnas: number;
    asientos: Asiento[];
}

const BASE_URL = '/funciones';

export const funcionesService = {
    listar: () =>
        api.get<Funcion[]>(BASE_URL),

    obtenerPorId: (id: number) =>
        api.get<Funcion>(`${BASE_URL}/${id}`),

    obtenerAsientos: (id: number) =>
        api.get<AsientosFuncion>(
            `${BASE_URL}/${id}/asientos`
        ),
};
