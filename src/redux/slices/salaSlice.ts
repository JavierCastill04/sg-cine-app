import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Sala } from "../../types/Sala";
import { salasData } from "../../data/salasData";
import { generarAsientos } from "../../components/asientos/asientosUtils";



const initialState: Sala[] = salasData.map((sala) => ({
    ...sala, asientos: generarAsientos(
        sala.id,
        sala.capacidad.filas,
        sala.capacidad.columnas
    )
}))

const salaSlice = createSlice({
    name: "sala",
    initialState,
    reducers: {
        addSala: (state, action: PayloadAction<Omit<Sala, 'id' | 'asientos'>>) => {
            const nuevoId =
                state.length > 0
                    ? Math.max(...state.map(sala => sala.id)) + 1
                    : 1;

            state.push({
                id: nuevoId,
                ...action.payload,
                asientos: generarAsientos(
                    nuevoId,
                    action.payload.capacidad.filas,
                    action.payload.capacidad.columnas
                ),
            });
        },

        updateSala: (state, action: PayloadAction<Sala>) => {
            const indice = state.findIndex(
                sala => sala.id === action.payload.id
            );

            if (indice === -1) {
                return;
            }

            const salaActual = state[indice];
            const capacidadNueva = action.payload.capacidad;

            const cambioDimensiones =
                salaActual.capacidad.filas !== capacidadNueva.filas ||
                salaActual.capacidad.columnas !== capacidadNueva.columnas;

            state[indice] = {
                ...action.payload,
                asientos: cambioDimensiones
                    ? generarAsientos(
                        action.payload.id,
                        capacidadNueva.filas,
                        capacidadNueva.columnas
                    )
                    : salaActual.asientos,
            };
        },

        removeSala: (state, action: PayloadAction<number>) => {
            const indice = state.findIndex(
                sala => sala.id === action.payload
            );

            if (indice !== -1) {
                state.splice(indice, 1);
            }
        },
    }
});

export const { addSala, updateSala, removeSala } = salaSlice.actions;
export default salaSlice.reducer;