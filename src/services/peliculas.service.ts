
import { api } from './api';
import type { Pelicula as PeliculaLocal } from '../types/Pelicula';

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

export interface CrearPeliculaRequest {
    codigo: string;
    nombre: string;
    genero: string;
    duracion: number;
    clasificacion: string;
    precio: number;
}

export interface CrearPeliculaResponse {
    message: string;
    pelicula: Pelicula;
}

export interface ActualizarPeliculaResponse {
    message: string;
}
const BASE_URL = '/peliculas';
export interface EliminarPeliculaResponse {
    message: string;
}
export type EstadoPelicula = 'Disponible' | 'No disponible';

export interface CambiarEstadoPeliculaResponse {
    message: string;
    id: number;
    estado: EstadoPelicula;
}
export const convertirPelicula = (
    pelicula: Pelicula
): PeliculaLocal => ({
    id: pelicula.id,
    codigo: pelicula.codigo,
    nombre: pelicula.nombre,
    genero: pelicula.genero,
    duracion: pelicula.duracion,
    clasificacion: pelicula.clasificacion,
    precio: Number(pelicula.precio),
    disponible: pelicula.estado.toLowerCase() === 'disponible',
});

export const peliculasService = {
    listar: () =>
        api.get<Pelicula[]>(BASE_URL),

    obtenerPorId: (id: number) =>
        api.get<Pelicula>(`${BASE_URL}/${id}`),


crear: (datos: CrearPeliculaRequest) =>
    api.post<CrearPeliculaResponse>(
        BASE_URL,
        datos,
        true
    ),


actualizar: (id: number, datos: CrearPeliculaRequest) =>
    api.put<ActualizarPeliculaResponse>(
        `${BASE_URL}/${id}`,
        datos,
        true
    ),


eliminar: (id: number) =>
    api.delete<EliminarPeliculaResponse>(
        `${BASE_URL}/${id}`,
        true
    ),

cambiarEstado: (id: number, estado: EstadoPelicula) =>
    api.patch<CambiarEstadoPeliculaResponse>(
        `${BASE_URL}/${id}/estado`,
        { estado },
        true
    ),


};
