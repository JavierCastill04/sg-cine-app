import { Asiento } from "./Asiento";
export interface Sala {
    id: number,
    nombre: string,
    capacidad: { filas: number, columnas: number },
    asientos: Asiento[]
}