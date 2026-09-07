import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { funcionesData } from "../../data/funcionesData";
import type { Funcion } from "../../types/Funcion";

const initialState: Funcion[] = funcionesData;

const funcionSlice = createSlice({
    name: "funcion",
    initialState,
    reducers: {

        addFuncion: (state, action: PayloadAction<Omit<Funcion, "id">>) => {
            const nuevoId = state.length > 0 ? Math.max(...state.map(f => f.id)) + 1 : 1;
            state.push({
                id: nuevoId,
                ...action.payload
            });
        },

        updateFuncion: (state, action: PayloadAction<Funcion>) => {
            const indice = state.findIndex(
                (pelicula) => pelicula.id === action.payload.id,
            );

            if (indice !== -1) {
                state[indice] = action.payload;
            }
        },

        removeFuncion: (state, action: PayloadAction<number>) => {
            const indice = state.findIndex(
                (pelicula) => pelicula.id === action.payload,
            );

            if (indice !== -1) {
                state.splice(indice, 1);
            }
        },

        reserveAsientos: (state, action: PayloadAction<{ funcionId: number; asientos: string[]; }>) => {
            const funcion = state.find(funcion => funcion.id === action.payload.funcionId);
            if (!funcion) return;

            action.payload.asientos.forEach(asientoId => {
                const asiento = funcion.estadoAsientos.find(asiento => asiento.asientoId === asientoId);
                if (asiento) {
                    asiento.estado = "reservado";
                } else {
                    funcion.estadoAsientos.push({
                        asientoId,
                        estado: "reservado"
                    });
                }
            });
        },
    },
});

export const { addFuncion, updateFuncion, removeFuncion, reserveAsientos } = funcionSlice.actions;

export default funcionSlice.reducer;