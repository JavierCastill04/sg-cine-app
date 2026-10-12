
import { createSlice } from '@reduxjs/toolkit';
import type { ReservaAPI } from '../../services/reservas.service';
import { cargarMisReservasThunk, crearReservaThunk, validarReservaThunk } from '../thunks/reservasThunks';

type EstadoSolicitud = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ReservasState {
    lista: ReservaAPI[];
    reservaCreada: ReservaAPI | null;
    reservaValidada: string | null;
    estadoCarga: EstadoSolicitud;
    estadoCreacion: EstadoSolicitud;
    estadoValidacion: EstadoSolicitud;
    errorCarga: string | null;
    errorCreacion: string | null;
    errorValidacion: string | null;
}

const initialState: ReservasState = {
    lista: [],
    reservaCreada: null,
    reservaValidada: null,
    estadoCarga: 'idle',
    estadoCreacion: 'idle',
    estadoValidacion: 'idle',
    errorCarga: null,
    errorCreacion: null,
    errorValidacion: null,
};

const reservasSlice = createSlice({
    name: 'reservas',
    initialState,
    reducers: {
        limpiarReservaCreada: (state) => {
            state.reservaCreada = null;
            state.estadoCreacion = 'idle';
            state.errorCreacion = null;
        },
        limpiarErrorReservas: (state) => {
            state.errorCarga = null;
            state.errorCreacion = null;
            state.errorValidacion = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(cargarMisReservasThunk.pending, (state) => {
                state.estadoCarga = 'loading';
                state.errorCarga = null;
            })
            .addCase(cargarMisReservasThunk.fulfilled, (state, action) => {
                state.estadoCarga = 'succeeded';
                state.lista = action.payload;
            })
            .addCase(cargarMisReservasThunk.rejected, (state, action) => {
                state.estadoCarga = 'failed';
                state.errorCarga =
                    action.payload ?? 'No se pudieron cargar las reservas.';
            })

            .addCase(crearReservaThunk.pending, (state) => {
                state.estadoCreacion = 'loading';
                state.errorCreacion = null;
                state.reservaCreada = null;
            })
            .addCase(crearReservaThunk.fulfilled, (state, action) => {
                state.estadoCreacion = 'succeeded';
                state.reservaCreada = action.payload;

                const indice = state.lista.findIndex(
                    (reserva) => reserva.id === action.payload.id
                );

                if (indice === -1) {
                    state.lista.unshift(action.payload);
                } else {
                    state.lista[indice] = action.payload;
                }
            })
            .addCase(crearReservaThunk.rejected, (state, action) => {
                state.estadoCreacion = 'failed';
                state.errorCreacion =
                    action.payload ?? 'No se pudo crear la reserva.';
            })

            .addCase(validarReservaThunk.pending, (state) => {
                state.estadoValidacion = 'loading';
                state.errorValidacion = null;
                state.reservaValidada = null;
            })
            .addCase(validarReservaThunk.fulfilled, (state, action) => {
                state.estadoValidacion = 'succeeded';
                state.reservaValidada = action.payload.codigo;

                const reserva = state.lista.find(
                    (item) => item.codigo === action.payload.codigo
                );

                if (reserva) {
                    reserva.estado = action.payload.estado;
                }

                if (
                    state.reservaCreada?.codigo === action.payload.codigo
                ) {
                    state.reservaCreada.estado = action.payload.estado;
                }
            })
            .addCase(validarReservaThunk.rejected, (state, action) => {
                state.estadoValidacion = 'failed';
                state.errorValidacion =
                    action.payload ?? 'No se pudo validar la reserva.';
            });
    },
});

export const {
    limpiarReservaCreada,
    limpiarErrorReservas,
} = reservasSlice.actions;

export default reservasSlice.reducer;