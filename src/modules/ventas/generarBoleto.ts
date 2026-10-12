
import * as Print from "expo-print";
import type { Venta } from "../../types/Venta";
import type { Pelicula } from "../../types/Pelicula";
import type { Sala } from "../../types/Sala";

interface DatosBoleto {
    venta: Venta;
    pelicula: Pelicula;
    sala: Sala;
    funcion: {
        fecha: string;
        horaInicio: string;
    };
    qr: string;
}

const escaparHTML = (valor: string): string =>
    valor.replace(/[&<>"']/g, caracter => {
        const entidades: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return entidades[caracter];
    });

const mostrarAsiento = (asiento: string): string => {
    const interno = asiento.match(/^\d+-([A-Z]+)-(\d+)$/);

    if (interno) {
        return `${interno[1]}${interno[2]}`;
    }

    const api = asiento.match(/^([A-Z]+)(\d+)$/);

    if (api) {
        return `${api[1]}${api[2]}`;
    }

    return asiento;
};

export const generarBoleto = async ({
    venta,
    pelicula,
    sala,
    funcion,
    qr,
}: DatosBoleto): Promise<string> => {
    const nombrePelicula = escaparHTML(pelicula.nombre);
    const nombreSala = escaparHTML(sala.nombre);
    const fecha = escaparHTML(funcion.fecha);
    const hora = escaparHTML(funcion.horaInicio);
    const asientos = venta.asientos
        .map(mostrarAsiento)
        .map(escaparHTML)
        .join(", ");
    const total = venta.total.toFixed(2);
    const codigo = escaparHTML(venta.token);

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 30px;
                }
                .boleto {
                    border: 2px solid #222;
                    border-radius: 15px;
                    padding: 25px;
                    max-width: 500px;
                    margin: auto;
                }
                h1 {
                    margin-bottom: 25px;
                }
                .dato {
                    margin: 8px 0;
                    font-size: 16px;
                }
                .total {
                    font-size: 20px;
                    font-weight: bold;
                    margin-top: 20px;
                }
                .qr {
                    margin-top: 25px;
                    width: 220px;
                    height: 220px;
                }
                .codigo {
                    font-size: 12px;
                    overflow-wrap: anywhere;
                    margin-top: 12px;
                }
            </style>
        </head>
        <body>
            <div class="boleto">
                <h1>Cine App</h1>

                <div class="dato">
                    <strong>${nombrePelicula}</strong>
                </div>

                <div class="dato">${nombreSala}</div>
                <div class="dato">${fecha} - ${hora}</div>

                <div class="dato">
                    <strong>Asientos:</strong> ${asientos}
                </div>

                <div class="dato">
                    Boletos: ${venta.cantidadBoletos}
                </div>

                <div class="total">
                    Total: $${total}
                </div>

                <img class="qr" src="${qr}" />

                <div class="codigo">
                    Código de reserva: ${codigo}
                </div>
            </div>
        </body>
        </html>
    `;

    const resultado = await Print.printToFileAsync({ html });

    return resultado.uri;
};