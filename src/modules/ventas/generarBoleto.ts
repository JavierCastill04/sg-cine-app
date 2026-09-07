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

export const generarBoleto = async ({
    venta,
    pelicula,
    sala,
    funcion,
    qr
}: DatosBoleto): Promise<string> => {

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
            </style>
        </head>

        <body>
            <div class="boleto">

                <h1>Cine App</h1>

                <div class="dato">
                    <strong>${pelicula.nombre}</strong>
                </div>

                <div class="dato">
                    ${sala.nombre}
                </div>

                <div class="dato">
                    ${funcion.fecha} - ${funcion.horaInicio}
                </div>

                <div class="dato">
                    Asientos:
                    ${venta.asientos
            .map(asiento => {
                const partes = asiento.split("-");
                return `${partes[1]}${partes[2]}`;
            })
            .join(", ")}
                </div>

                <div class="dato">
                    Boletos: ${venta.cantidadBoletos}
                </div>

                <div class="total">
                    Total: $${venta.total.toFixed(2)}
                </div>

                <img
                    class="qr"
                    src="${qr}"
                />

            </div>
        </body>
        </html>
    `;

    const resultado = await Print.printToFileAsync({
        html
    });

    return resultado.uri;
};