import { createAsyncThunk } from '@reduxjs/toolkit';
import { funcionesService, type FuncionApi, type CrearFuncionRequest, type FiltrosFunciones, type AsientosFuncion, type RespuestaCancelacion, } from '../../services/funciones.service';
import type { Funcion } from '../../types/Funcion';
import type { EstadoAsiento } from '../../types/EstadoAsiento';

const convertirFuncion = (funcion: FuncionApi): Funcion => {
    const fechaHora = new Date(funcion.fechaHora);

    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/El_Salvador',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(fechaHora);

    const obtenerParte = (tipo: string) =>
        partes.find(parte => parte.type === tipo)?.value ?? '';

    const fecha = [
        obtenerParte('year'),
        obtenerParte('month'),
        obtenerParte('day'),
    ].join('-');

    const horaInicio = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'America/El_Salvador',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
    }).format(fechaHora);

    return {
        ...funcion,
        fecha,
        horaInicio,
        estadoAsientos: [],
    };
};

export const cargarFunciones = createAsyncThunk<
    Funcion[],
    FiltrosFunciones | undefined,
    { rejectValue: string }
>(
    'funcion/cargar',
    async (filtros, { rejectWithValue }) => {
        try {
            const respuesta = await funcionesService.listar(filtros);
            return respuesta.map(convertirFuncion);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudieron cargar las funciones.'
            );
        }
    }
);

export const cargarFuncionPorId = createAsyncThunk<
    Funcion,
    number,
    { rejectValue: string }
>(
    'funcion/obtenerPorId',
    async (id, { rejectWithValue }) => {
        try {
            const respuesta = await funcionesService.obtenerPorId(id);
            return convertirFuncion(respuesta);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudo consultar la función.'
            );
        }
    }
);

export const cargarAsientosFuncion = createAsyncThunk<
    { funcionId: number; estadoAsientos: EstadoAsiento[] },
    { funcionId: number; salaId: number },
    { rejectValue: string }
>(
    'funcion/cargarAsientos',
    async ({ funcionId }, { rejectWithValue }) => {
        try {
            const respuesta = await funcionesService.obtenerAsientos(funcionId);

            const estadoAsientos: EstadoAsiento[] = respuesta.asientos.map(
                ({ asiento, estado }) => ({
                    asientoId: asiento,
                    estado: estado === 'ocupado' ? 'reservado' : 'disponible',
                })
            );

            return { funcionId, estadoAsientos };
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudieron consultar los asientos.'
            );
        }
    }
);
export const crearFuncionThunk = createAsyncThunk<
    Funcion,
    CrearFuncionRequest,
    { rejectValue: string }
>(
    'funcion/crear',
    async (datos, { rejectWithValue }) => {
        try {
            const respuesta = await funcionesService.crear(datos);
            const funcion = await funcionesService.obtenerPorId(
                respuesta.funcion.id
            );

            return convertirFuncion(funcion);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudo crear la función.'
            );
        }
    }
);

export const reprogramarFuncionThunk = createAsyncThunk<
    Funcion,
    { id: number; datos: CrearFuncionRequest },
    { rejectValue: string }
>(
    'funcion/reprogramar',
    async ({ id, datos }, { rejectWithValue }) => {
        try {
            await funcionesService.actualizar(id, datos);

            const funcion = await funcionesService.obtenerPorId(id);

            return convertirFuncion(funcion);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudo reprogramar la función.'
            );
        }
    }
);

export const cancelarFuncionThunk = createAsyncThunk<
    RespuestaCancelacion,
    number,
    { rejectValue: string }
>(
    'funcion/cancelar',
    async (id, { rejectWithValue }) => {
        try {
            return await funcionesService.cancelar(id);
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudo cancelar la función.'
            );
        }
    }
);