import { EstadoAsiento } from "./EstadoAsiento";
export interface Funcion {
    id: number;
    peliculaId: number;
    salaId: number;
    fecha: string;
    horaInicio: string;
    estadoAsientos: EstadoAsiento[];
}