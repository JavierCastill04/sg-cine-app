import { generarAsientos } from "./asientosUtils";
import AsientosSecciones from "./AsientosSecciones";
import type { EstadoAsiento } from "../../types/EstadoAsiento";

interface SeatGridProps {
    filas: number;
    columnas: number;
    salaId?: number;
    estadoAsientos?: EstadoAsiento[];
    seleccionados?: string[];
    onSeleccionar?: (asiento: string) => void;
}

export default function AsientosGrid({
    filas, columnas, salaId, estadoAsientos = [], seleccionados = [], onSeleccionar
}: SeatGridProps) {
    const asientos = generarAsientos(salaId ?? 0, filas, columnas);

    return (
        <AsientosSecciones
            asientos={asientos}
            columnas={columnas}
            estadoAsientos={estadoAsientos}
            seleccionados={seleccionados}
            onSeleccionar={onSeleccionar}
        />
    );
}