import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Venta } from "../../types/Venta";

const initialState: Venta[] = [];

const ventaSlice = createSlice({
    name: "venta",
    initialState,
    reducers: {
        addVenta: (state, action: PayloadAction<Venta>) => {
            const nuevoId =
                state.length > 0
                    ? Math.max(...state.map(venta => venta.id)) + 1
                    : 1;

            state.push({
                ...action.payload,
                id: nuevoId
            });
        },

        marcarTokenUsado: (state, action: PayloadAction<string>) => {
            const venta = state.find(
                venta => venta.token === action.payload
            );

            if (venta) {
                venta.tokenUsado = true;
            }
        }
    }
});

export const { addVenta, marcarTokenUsado } = ventaSlice.actions;

export default ventaSlice.reducer;