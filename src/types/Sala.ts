import { Asiento } from "./Asiento";
export interface Sala {
    id: number,
    cineId: number;
    nombre: string;
    capacidad: { filas: number, columnas: number };
    asientos: Asiento[];
}