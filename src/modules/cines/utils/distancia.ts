
import type { Cine } from '../../../services/cines.service';

export interface Ubicacion {
    latitud: number;
    longitud: number;
}

export interface CineConDistancia extends Cine {
    distanciaKm: number | null;
}

export function calcularDistanciaKm(
    origen: Ubicacion,
    destino: Ubicacion
): number {
    const radioTierraKm = 6371;

    const convertirRadianes = (grados: number) =>
        (grados * Math.PI) / 180;

    const diferenciaLatitud = convertirRadianes(
        destino.latitud - origen.latitud
    );

    const diferenciaLongitud = convertirRadianes(
        destino.longitud - origen.longitud
    );

    const a =
        Math.sin(diferenciaLatitud / 2) ** 2 +
        Math.cos(convertirRadianes(origen.latitud)) *
            Math.cos(convertirRadianes(destino.latitud)) *
            Math.sin(diferenciaLongitud / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return radioTierraKm * c;
}

export function ordenarCinesPorDistancia(
    cines: Cine[],
    ubicacionUsuario: Ubicacion
): CineConDistancia[] {
    return cines
        .map((cine) => {
            const latitud =
                cine.latitud === null
                    ? NaN
                    : Number(cine.latitud);

            const longitud =
                cine.longitud === null
                    ? NaN
                    : Number(cine.longitud);

            const coordenadasValidas =
                Number.isFinite(latitud) &&
                Number.isFinite(longitud) &&
                latitud >= -90 &&
                latitud <= 90 &&
                longitud >= -180 &&
                longitud <= 180;

            return {
                ...cine,
                distanciaKm: coordenadasValidas
                    ? calcularDistanciaKm(
                          ubicacionUsuario,
                          { latitud, longitud }
                      )
                    : null,
            };
        })
        .sort((a, b) => {
            if (a.distanciaKm === null) return 1;
            if (b.distanciaKm === null) return -1;

            return a.distanciaKm - b.distanciaKm;
        });
}
