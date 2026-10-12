
import { createAsyncThunk } from '@reduxjs/toolkit';
import { reservasService, type CrearReservaRequest, type ReservaAPI, type ValidarReservaResponse } from '../../services/reservas.service';

export const crearReservaThunk = createAsyncThunk<
    ReservaAPI,
    CrearReservaRequest,
    { rejectValue: string }
>(
    'reservas/crear',
    async (datos, { rejectWithValue }) => {
        try {
            const respuesta = await reservasService.crear(datos);
            return respuesta.reserva;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudo crear la reserva.'
            );
        }
    }
);

export const cargarMisReservasThunk = createAsyncThunk<
    ReservaAPI[],
    void,
    { rejectValue: string }
>(
    'reservas/cargarMisReservas',
    async (_, { rejectWithValue }) => {
        try {
            return await reservasService.misReservas();
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudieron cargar tus reservas.'
            );
        }
    }
);

export const validarReservaThunk = createAsyncThunk<
    ValidarReservaResponse,
    string,
    { rejectValue: string }
>(
    'reservas/validar',
    async (codigo, { rejectWithValue }) => {
        try {
            return await reservasService.validar(codigo);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudo validar la reserva.'
            );
        }
    }
);