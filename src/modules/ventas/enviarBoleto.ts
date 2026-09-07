import * as MailComposer from "expo-mail-composer";
import type { Venta } from "../../types/Venta";

export const enviarBoleto = async (
    venta: Venta,
    pdfUri: string
): Promise<void> => {

    const disponible = await MailComposer.isAvailableAsync();

    if (!disponible) {
        throw new Error(
            "No hay una aplicación de correo disponible en el dispositivo."
        );
    }

    await MailComposer.composeAsync({
        recipients: [venta.cliente.correo],
        subject: "Tu boleto - Cine App",
        body: `Hola ${venta.cliente.nombre},

        Tu compra se realizó correctamente.

        Adjuntamos tu boleto de cine con el código QR. 
        Preséntalo en la entrada para acceder a tu función.

        ¡Gracias por comprar con Cine App!`,
        attachments: [pdfUri]
    });
};