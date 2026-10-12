
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Sala } from '../../types/Sala';
import { generarAsientos } from '../../components/asientos/asientosUtils';
import {
    cargarSalas,
    obtenerSalaThunk,
    crearSalaThunk,
    actualizarSalaThunk,
    eliminarSalaThunk,
} from '../thunks/salaThunks';

const initialState: Sala[] = [];

const salaSlice = createSlice({
    name: 'sala',
    initialState,
    reducers: {
        addSala: (state, action: PayloadAction<Omit<Sala, 'id' | 'asientos'>>) => {
            const id = state.length
                ? Math.max(...state.map(sala => sala.id)) + 1
                : 1;

            state.push({
                id,
                ...action.payload,
                asientos: generarAsientos(
                    id,
                    action.payload.capacidad.filas,
                    action.payload.capacidad.columnas
                ),
            });
        },

        updateSala: (state, action: PayloadAction<Sala>) => {
            const indice = state.findIndex(s => s.id === action.payload.id);
            if (indice === -1) return;

            const actual = state[indice];
            const nueva = action.payload;
            const cambioDimensiones =
                actual.capacidad.filas !== nueva.capacidad.filas ||
                actual.capacidad.columnas !== nueva.capacidad.columnas;

            state[indice] = {
                ...nueva,
                asientos: cambioDimensiones
                    ? generarAsientos(
                        nueva.id,
                        nueva.capacidad.filas,
                        nueva.capacidad.columnas
                    )
                    : actual.asientos,
            };
        },

        removeSala: (state, action: PayloadAction<number>) => {
            const indice = state.findIndex(s => s.id === action.payload);
            if (indice !== -1) state.splice(indice, 1);
        },
    },

    extraReducers: builder => {
        builder
            .addCase(cargarSalas.fulfilled, (_state, action) =>
                action.payload.map(sala => ({
                    ...sala,
                    asientos: generarAsientos(
                        sala.id,
                        sala.capacidad.filas,
                        sala.capacidad.columnas
                    ),
                }))
            )
            .addCase(obtenerSalaThunk.fulfilled, (state, action) => {
                const sala = action.payload;
                const indice = state.findIndex(s => s.id === sala.id);
                const actual = indice === -1 ? undefined : state[indice];

                const cambioDimensiones =
                    !actual ||
                    actual.capacidad.filas !== sala.capacidad.filas ||
                    actual.capacidad.columnas !== sala.capacidad.columnas;

                const salaActualizada: Sala = {
                    ...sala,
                    asientos: cambioDimensiones
                        ? generarAsientos(
                            sala.id,
                            sala.capacidad.filas,
                            sala.capacidad.columnas
                        )
                        : actual.asientos,
                };

                if (indice === -1) state.push(salaActualizada);
                else state[indice] = salaActualizada;
            })
            .addCase(crearSalaThunk.fulfilled, (state, action) => {
                const sala = action.payload;
                const indice = state.findIndex(s => s.id === sala.id);
                const nuevaSala: Sala = {
                    ...sala,
                    asientos: generarAsientos(
                        sala.id,
                        sala.capacidad.filas,
                        sala.capacidad.columnas
                    ),
                };

                if (indice === -1) state.push(nuevaSala);
                else state[indice] = nuevaSala;
            })
            .addCase(actualizarSalaThunk.fulfilled, (state, action) => {
                const { id, datos, sala } = action.payload;
                const indice = state.findIndex(s => s.id === id);
                if (indice === -1) return;

                const actual = state[indice];
                const capacidad = {
                    filas: datos.filas,
                    columnas: datos.columnas,
                };

                const cambioDimensiones =
                    actual.capacidad.filas !== capacidad.filas ||
                    actual.capacidad.columnas !== capacidad.columnas;

                state[indice] = {
                    ...(sala ?? actual),
                    id,
                    nombre: sala?.nombre ?? datos.nombre,
                    capacidad: sala?.capacidad ?? capacidad,
                    asientos: cambioDimensiones
                        ? generarAsientos(id, capacidad.filas, capacidad.columnas)
                        : actual.asientos,
                };
            })
            .addCase(eliminarSalaThunk.fulfilled, (state, action) => {
                const indice = state.findIndex(s => s.id === action.payload);
                if (indice !== -1) state.splice(indice, 1);
            });
    },
});

export const { addSala, updateSala, removeSala } = salaSlice.actions;
export default salaSlice.reducer;