import type { Usuario } from './Usuario';

export interface AuthState {
    autenticado: boolean;
    usuario: Usuario | null;
    token: string | null;
    biometriaActiva: boolean;
    usuarioBiometria: Usuario | null;
    accesoPersonalAutorizado: boolean;
    versionSesion: number;
}