import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Funcion } from '../../types/Funcion';
import { cargarFunciones, cargarFuncionPorId, cargarAsientosFuncion, crearFuncionThunk, reprogramarFuncionThunk, cancelarFuncionThunk } from '../thunks/funcionThunks';

const initialState: Funcion[] = [];

const funcionSlice = createSlice({
    name: 'funcion',
    initialState,
    reducers: {
        reserveAsientos: (
            state,
            action: PayloadAction<{
                funcionId: number;
                asientos: string[];
            }>
        ) => {
            const funcion = state.find(
                f => f.id === action.payload.funcionId
            );

            if (!funcion) return;

            action.payload.asientos.forEach(asientoId => {
                const asiento = funcion.estadoAsientos.find(
                    a => a.asientoId === asientoId
                );

                if (asiento) {
                    asiento.estado = 'reservado';
                } else {
                    funcion.estadoAsientos.push({
                        asientoId,
                        estado: 'reservado',
                    });
                }
            });
        },
    },

    extraReducers: builder => {
        builder
            .addCase(cargarFunciones.fulfilled, (_state, action) => {
                return action.payload;
            })

            .addCase(cargarFuncionPorId.fulfilled, (state, action) => {
                const indice = state.findIndex(
                    f => f.id === action.payload.id
                );

                if (indice !== -1) {
                    state[indice] = action.payload;
                } else {
                    state.push(action.payload);
                }
            })

            .addCase(crearFuncionThunk.fulfilled, (state, action) => {
                const indice = state.findIndex(
                    f => f.id === action.payload.id
                );

                if (indice !== -1) {
                    state[indice] = action.payload;
                } else {
                    state.push(action.payload);
                }
            })

            .addCase(reprogramarFuncionThunk.fulfilled, (state, action) => {
                const indice = state.findIndex(
                    f => f.id === action.payload.id
                );

                if (indice !== -1) {
                    state[indice] = action.payload;
                } else {
                    state.push(action.payload);
                }
            })

            .addCase(cancelarFuncionThunk.fulfilled, (state, action) => {
                const funcion = state.find(
                    f => f.id === action.payload.id
                );

                if (funcion) {
                    funcion.estado = action.payload.estado;
                }
            })

            .addCase(cargarAsientosFuncion.fulfilled, (state, action) => {
                const funcion = state.find(
                    f => f.id === action.payload.funcionId
                );

                if (funcion) {
                    funcion.estadoAsientos = action.payload.estadoAsientos;
                }
            });
    },
});

export const { reserveAsientos } = funcionSlice.actions;

export default funcionSlice.reducer;