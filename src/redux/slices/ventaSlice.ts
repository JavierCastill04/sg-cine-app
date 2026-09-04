import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Venta } from "../../types/Venta";

const initialState: Venta[] = [];
const ventaSlice = createSlice({
    name: "venta",
    initialState,
    reducers: {
        addVenta: (state, action: PayloadAction<Venta>) => {
            const nuevoId = state.length > 0 ? Math.max(...state.map(venta => venta.id)) + 1 : 1;

            state.push({
                ...action.payload,
                id: nuevoId
            });
        }
    }
});

export const { addVenta } = ventaSlice.actions;
export default ventaSlice.reducer;