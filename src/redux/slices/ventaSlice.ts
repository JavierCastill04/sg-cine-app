
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Venta } from "../../types/Venta";
import {
    cargarMisReservasThunk,
    crearReservaThunk,
} from "../thunks/reservasThunks";
import type { ReservaAPI } from "../../services/reservas.service";

const initialState: Venta[] = [];

const convertirReserva = (reserva: ReservaAPI): Venta => ({
    id: reserva.id,
    funcionId: reserva.funcionId,
    asientos: reserva.asientos,
    cantidadBoletos: reserva.asientos.length,
    total: Number(reserva.total),
    token: reserva.codigo,
    tokenUsado: reserva.estado === "utilizada",
    peliculaNombre: reserva.pelicula,
    salaNombre: reserva.sala,
    fechaHoraFuncion: reserva.fechaHora,
    cineNombre: reserva.cine,
    estadoReserva: reserva.estado,
});

const guardarReserva = (state: Venta[], reserva: ReservaAPI) => {
    const venta = convertirReserva(reserva);
    const indice = state.findIndex(item => item.id === venta.id);

    if (indice === -1) {
        state.push(venta);
    } else {
        state[indice] = {
            ...state[indice],
            ...venta,
            usuario: state[indice].usuario,
        };
    }
};

const ventaSlice = createSlice({
    name: "venta",
    initialState,
    reducers: {
        addVenta: (state, action: PayloadAction<Venta>) => {
            const indice = state.findIndex(
                venta => venta.id === action.payload.id
            );

            if (indice === -1) {
                state.push(action.payload);
            } else {
                state[indice] = action.payload;
            }
        },

        marcarTokenUsado: (state, action: PayloadAction<string>) => {
            const venta = state.find(
                venta => venta.token === action.payload
            );

            if (venta) {
                venta.tokenUsado = true;
                venta.estadoReserva = "utilizada";
            }
        },

        limpiarVentas: () => [],
    },
    extraReducers: builder => {
        builder
            .addCase(cargarMisReservasThunk.fulfilled, (state, action) => {
                action.payload.forEach(reserva => {
                    guardarReserva(state, reserva);
                });
            })
            .addCase(crearReservaThunk.fulfilled, (state, action) => {
                guardarReserva(state, action.payload);
            });
    },
});

export const { addVenta, marcarTokenUsado, limpiarVentas } = ventaSlice.actions;

export default ventaSlice.reducer;