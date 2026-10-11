
import type { Usuario } from "./Usuario";

export interface AuthState {
    autenticado: boolean;
    usuario: Usuario | null;
    biometriaActiva: boolean;
    usuarioBiometria: Usuario | null;
    accesoPersonalAutorizado: boolean;
    versionSesion: number;
}
