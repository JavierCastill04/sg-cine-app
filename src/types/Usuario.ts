
export interface Usuario {
    id: number;
    correo: string;
    nombre: string;
    rol: "cliente" | "personal";
}
