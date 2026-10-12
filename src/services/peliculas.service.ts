
import { api } from './api';

export interface Pelicula {
    id: number;
    codigo: string;
    nombre: string;
    genero: string;
    duracion: number;
    clasificacion: string;
    precio: string;
    estado: string;
}

const BASE_URL = '/peliculas';

export const peliculasService = {
    listar: () =>
        api.get<Pelicula[]>(BASE_URL),

    obtenerPorId: (id: number) =>
        api.get<Pelicula>(`${BASE_URL}/${id}`),
};
