
import type { Sala } from '../../types/Sala';

export type Campo = 'nombre' | 'filas' | 'columnas';
export type FormData = Record<Campo, string>;
export type FormErrors = Record<Campo, string>;

export function validarCampo(
    campo: Campo,
    valor: string,
    salas: Sala[],
    salaEditando?: Sala,
    cineId?: number | null
): string {
    const valorLimpio = valor.trim();

    switch (campo) {
        case 'nombre': {
            if (!valorLimpio) return 'El nombre de la sala es obligatorio';
            if (!/^Sala \d+$/i.test(valorLimpio)) return 'El formato debe ser "Sala #"';
            if (valorLimpio.length < 6) return 'Mínimo 6 caracteres';

            const existe = salas.some(sala =>
                sala.nombre.toLowerCase() === valorLimpio.toLowerCase() &&
                sala.id !== salaEditando?.id &&
                sala.cineId === cineId
            );

            return existe ? 'Ya existe una sala con ese nombre en este cine' : '';
        }

        case 'filas':
            if (!valorLimpio) return 'La cantidad de filas es obligatoria';
            return /^[1-9]\d*$/.test(valorLimpio) ? '' : 'Cantidad inválida';

        case 'columnas':
            if (!valorLimpio) return 'La cantidad de columnas es obligatoria';
            return /^[1-9]\d*$/.test(valorLimpio) ? '' : 'Cantidad inválida';

        default:
            return '';
    }
}