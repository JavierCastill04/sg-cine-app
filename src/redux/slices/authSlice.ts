import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Usuario } from "../../types/Usuario";
import type { AuthState } from "../../types/AuthState";


const initialState: AuthState = {
    autenticado: false,
    usuario: null,
    biometriaActiva: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<Usuario>) => {
            state.autenticado = true;
            state.usuario = action.payload;
        },

        logout: state => {
            state.autenticado = false;
            state.usuario = null;
        },

        activarBiometria: state => {
            state.biometriaActiva = true;
        },

        desactivarBiometria: state => {
            state.biometriaActiva = false;
        }
    }
});

export const {
    login,
    logout,
    activarBiometria,
    desactivarBiometria
} = authSlice.actions;

export default authSlice.reducer;