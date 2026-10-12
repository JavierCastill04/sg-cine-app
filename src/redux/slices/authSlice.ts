
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Usuario } from "../../types/Usuario";
import type { AuthState } from "../../types/AuthState";

const initialState: AuthState = {
    autenticado: false,
    usuario: null,
    token: null,
    biometriaActiva: false,
    usuarioBiometria: null,
    accesoPersonalAutorizado: false,
    versionSesion: 0,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
login: (
    state,
    action: PayloadAction<{
        usuario: Usuario;
        token: string | null;
    }>
) => {
    state.versionSesion += 1;
    state.autenticado = true;
    state.usuario = action.payload.usuario;
    state.token = action.payload.token;
    state.accesoPersonalAutorizado = false;
},

      logout: state => {
    state.versionSesion += 1;
    state.autenticado = false;
    state.usuario = null;
    state.token = null;
    state.accesoPersonalAutorizado = false;
},

        activarBiometria: (
            state,
            action: PayloadAction<Usuario>
        ) => {
            state.biometriaActiva = true;
            state.usuarioBiometria = action.payload;
        },

        desactivarBiometria: state => {
            state.biometriaActiva = false;
            state.usuarioBiometria = null;
            state.accesoPersonalAutorizado = false;
        },

        autorizarAccesoPersonal: (
            state,
            action: PayloadAction<{
                usuarioId: number;
                versionSesion: number;
            }>
        ) => {
            if (
                state.autenticado &&
                state.usuario?.rol === "personal" &&
                state.usuario.id === action.payload.usuarioId &&
                state.versionSesion === action.payload.versionSesion
            ) {
                state.accesoPersonalAutorizado = true;
            }
        },

        revocarAccesoPersonal: state => {
            state.accesoPersonalAutorizado = false;
        },
    },
});

export const {
    login,
    logout,
    activarBiometria,
    desactivarBiometria,
    autorizarAccesoPersonal,
    revocarAccesoPersonal,
} = authSlice.actions;

export default authSlice.reducer;
