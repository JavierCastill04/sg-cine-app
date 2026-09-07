export interface Usuario {
    id: number;
    usuario: string;
    nombre: string;
    rol: "admin" | "empleado";
}