import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { peliculasData } from "../../data/peliculasData";
import type { Pelicula } from "../../types/Pelicula";

const initialState: Pelicula[] = peliculasData;

const peliculaSlice = createSlice({
    name: "pelicula",
    initialState,
    reducers: {
        addPelicula: (state, action: PayloadAction<Pelicula>) => {
            state.push(action.payload);
        },

        updatePelicula: (state, action: PayloadAction<Pelicula>) => {
            const indice = state.findIndex(
                (pelicula) => pelicula.id === action.payload.id,
            );

            if (indice !== -1) {
                state[indice] = action.payload;
            }
        },

        removePelicula: (state, action: PayloadAction<number>) => {
            const indice = state.findIndex(
                (pelicula) => pelicula.id === action.payload,
            );

            if (indice !== -1) {
                state.splice(indice, 1);
            }
        },
    },
});

export const {
    addPelicula,
    updatePelicula,
    removePelicula,
} = peliculaSlice.actions;

export default peliculaSlice.reducer;