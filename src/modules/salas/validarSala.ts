import type { Sala } from '../../types/Sala';

export type Campo = 'nombre' | 'filas' | 'columnas';
export type FormData = Record<Campo, string>;
export type FormErrors = Record<Campo, string>;

export function validarCampo(campo: Campo, valor: string, salas: Sala[], salaEditando?: Sala): string {

    const valorLimpio = valor.trim();

    switch (campo) {

        case 'nombre': {
            if (!valorLimpio) {
                return 'El nombre de la sala es obligatorio';
            }

            if (!/^Sala \d+$/.test(valorLimpio)) {
                return 'El formato debe ser "Sala #"';
            }

            if (valorLimpio.length < 6) {
                return 'Mínimo 6 caracteres';
            }

            const nombreExiste = salas.some(
                salaActual =>
                    salaActual.nombre.toLowerCase() ===
                    valorLimpio.toLowerCase() &&
                    salaActual.id !== salaEditando?.id
            );

            if (nombreExiste) {
                return 'Ya existe una sala con ese nombre';
            }
            return '';
        }

        case 'filas':
            if (!valorLimpio) {
                return 'La cantidad de filas es obligatoria';
            }

            if (!/^[1-9]\d*$/.test(valorLimpio)) {
                return 'Cantidad inválida';
            }

            return '';

        case 'columnas':
            if (!valorLimpio) {
                return 'La cantidad de columnas es obligatoria';
            }

            if (!/^[1-9]\d*$/.test(valorLimpio)) {
                return 'Cantidad inválida';
            }

            return '';

        default:
            return '';
    }
}