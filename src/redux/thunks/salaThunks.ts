import { createAsyncThunk } from '@reduxjs/toolkit';
import { salasService, convertirSala, type CrearSalaRequest, } from '../../services/salas.service';
import type { Sala } from '../../types/Sala';

type ThunkConfig = { rejectValue: string };

const obtenerError = (error: unknown, mensaje: string) =>
    error instanceof Error ? error.message : mensaje;

export const cargarSalas = createAsyncThunk<
    Sala[],
    number | undefined,
    ThunkConfig
>(
    'sala/cargar',
    async (cineId, { rejectWithValue }) => {
        try {
            return await salasService.listar(cineId);
        } catch (error) {
            return rejectWithValue(
                obtenerError(error, 'No se pudieron cargar las salas.')
            );
        }
    }
);

export const obtenerSalaThunk = createAsyncThunk<
    Sala,
    number,
    ThunkConfig
>(
    'sala/obtenerPorId',
    async (id, { rejectWithValue }) => {
        try {
            return await salasService.obtenerPorId(id);
        } catch (error) {
            return rejectWithValue(
                obtenerError(error, 'No se pudo obtener la sala.')
            );
        }
    }
);

export const crearSalaThunk = createAsyncThunk<
    Sala,
    CrearSalaRequest,
    ThunkConfig
>(
    'sala/crear',
    async (datos, { rejectWithValue }) => {
        try {
            const respuesta = await salasService.crear(datos);
            return convertirSala(respuesta.sala);
        } catch (error) {
            return rejectWithValue(
                obtenerError(error, 'No se pudo crear la sala.')
            );
        }
    }
);

export const actualizarSalaThunk = createAsyncThunk<
    { id: number; datos: CrearSalaRequest; sala?: Sala },
    { id: number; datos: CrearSalaRequest },
    ThunkConfig
>(
    'sala/actualizar',
    async ({ id, datos }, { rejectWithValue }) => {
        try {
            const respuesta = await salasService.actualizar(id, datos);

            return {
                id,
                datos,
                sala: respuesta.sala
                    ? convertirSala(respuesta.sala)
                    : undefined,
            };
        } catch (error) {
            return rejectWithValue(
                obtenerError(error, 'No se pudo actualizar la sala.')
            );
        }
    }
);

export const eliminarSalaThunk = createAsyncThunk<
    number,
    number,
    ThunkConfig
>(
    'sala/eliminar',
    async (id, { rejectWithValue }) => {
        try {
            await salasService.eliminar(id);
            return id;
        } catch (error) {
            return rejectWithValue(
                obtenerError(error, 'No se pudo eliminar la sala.')
            );
        }
    }
);