export interface Asiento {
    id: string;
    idSala: number,
    ubicacion: { letraFila: string, columna: number };
}