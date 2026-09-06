import { Asiento } from "./Asiento";

export interface Seccion {
    id: string;
    nombre: string;
    asientos: Asiento[];
    columnas: number;
}