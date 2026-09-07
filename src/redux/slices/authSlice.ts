import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Usuario } from "../../types/Usuario";
import type { AuthState } from "../../types/AuthState";


const initialState: AuthState = {
    autenticado: false,
    usuario: null,
    biometriaActiva: false,
    usuarioBiometria: null
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

        activarBiometria: (state, action: PayloadAction<Usuario>) => {
            state.biometriaActiva = true;
            state.usuarioBiometria = action.payload;
        },

        desactivarBiometria: state => {
            state.biometriaActiva = false;
            state.usuarioBiometria = null;
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