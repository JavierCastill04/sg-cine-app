import { Usuario } from "../types/Usuario";

export interface UsuarioData extends Usuario {
    contraseña: string;
}

export const usuariosData: UsuarioData[] = [
    {
        id: 1,
        usuario: "admin",
        contraseña: "1234",
        nombre: "Administrador",
        rol: "admin"
    }
];