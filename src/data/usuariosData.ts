
import type { Usuario } from "../types/Usuario";

export interface UsuarioData extends Usuario {
    contraseña: string;
}

export const usuariosData: UsuarioData[] = [
    {
        id: 1,
        usuario: "admin",
        contraseña: "1234",
        nombre: "Administrador",
        rol: "personal",
    },
    {
        id: 2,
        usuario: "ana",
        contraseña: "1234",
        nombre: "Ana",
        rol: "cliente",
    },
];
