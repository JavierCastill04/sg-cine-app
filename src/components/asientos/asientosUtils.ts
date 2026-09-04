import { Asiento } from "../../types/Asiento"

export const obtenerLetraFila = (index: number): string => {
    let letra = "";
    let n = index + 1;

    while (n > 0) {
        let resto = (n - 1) % 26;
        letra = String.fromCharCode(65 + resto) + letra;
        n = Math.floor((n - resto) / 26);
    }
    return letra;
};

export const generarAsientos = (salaId: number, filas: number, columnas: number): Asiento[] => {
    const asientos: Asiento[] = [];

    for (let fila = 0; fila < filas; fila++) {
        const letraFila = obtenerLetraFila(fila);
        for (let columna = 1; columna <= columnas; columna++) {
            asientos.push({
                id: `${salaId}-${letraFila}-${columna}`,
                idSala: salaId,
                ubicacion: { letraFila, columna }
            });
        }
    }
    return asientos;
};