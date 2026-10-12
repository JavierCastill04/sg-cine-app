import { createAsyncThunk } from '@reduxjs/toolkit';
import { peliculasService, convertirPelicula, type CrearPeliculaRequest, type EstadoPelicula, } from '../../services/peliculas.service';
import type { Pelicula } from '../../types/Pelicula';

export const cargarPeliculas = createAsyncThunk<
    Pelicula[],
    void,
    { rejectValue: string }
>(
    'pelicula/cargar',
    async (_, { rejectWithValue }) => {
        try {
            const respuesta = await peliculasService.listar();
            return respuesta.map(convertirPelicula);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudieron cargar las películas.'
            );
        }
    }
);

export const crearPeliculaThunk = createAsyncThunk<
    Pelicula,
    CrearPeliculaRequest,
    { rejectValue: string }
>(
    'pelicula/crear',
    async (datos, { rejectWithValue }) => {
        try {
            const respuesta = await peliculasService.crear(datos);
            return convertirPelicula(respuesta.pelicula);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudo crear la película.'
            );
        }
    }
);

export const actualizarPeliculaThunk = createAsyncThunk<
    { id: number; datos: CrearPeliculaRequest },
    { id: number; datos: CrearPeliculaRequest },
    { rejectValue: string }
>(
    'pelicula/actualizar',
    async ({ id, datos }, { rejectWithValue }) => {
        try {
            await peliculasService.actualizar(id, datos);
            return { id, datos };
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudo actualizar la película.'
            );
        }
    }
);

export const eliminarPeliculaThunk = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>(
    'pelicula/eliminar',
    async (id, { rejectWithValue }) => {
        try {
            await peliculasService.eliminar(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudo eliminar la película.'
            );
        }
    }
);

export const cambiarDisponibilidadThunk = createAsyncThunk<
    { id: number; disponible: boolean },
    { id: number; estado: EstadoPelicula },
    { rejectValue: string }
>(
    'pelicula/cambiarDisponibilidad',
    async ({ id, estado }, { rejectWithValue }) => {
        try {
            const respuesta = await peliculasService.cambiarEstado(
                id,
                estado
            );

            return {
                id: respuesta.id,
                disponible:
                    respuesta.estado.toLowerCase() === 'disponible',
            };
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudo cambiar la disponibilidad.'
            );
        }
    }
);