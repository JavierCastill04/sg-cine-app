import { api } from './api';

export interface LoginRequest {
    correo: string;
    clave: string;
}

export interface UsuarioAPI {
    id: number;
    nombre: string;
    correo: string;
    rol: 'cliente' | 'personal';
}

export interface LoginResponse {
    message: string;
    token: string;
    usuario: UsuarioAPI;
}

const BASE_URL = '/usuarios';

export const usuariosService = {
    iniciarSesion: (datos: LoginRequest) =>
        api.post<LoginResponse>(
            `${BASE_URL}/login`,
            datos
        ),
};