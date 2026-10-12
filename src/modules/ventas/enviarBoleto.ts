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

    const resultado = await MailComposer.composeAsync({
        recipients: [venta.usuario.correo],
        subject: "Tu boleto - Cine App",
        body: `Hola ${venta.usuario.nombre},

Tu reserva se realizó correctamente.

Adjuntamos tu boleto de cine con el código QR.
Preséntalo en la entrada para acceder a tu función.

¡Gracias por reservar con Cine App!`,
        attachments: [pdfUri],
    });

    if (resultado.status === "sent") {
        return;
    }

    if (resultado.status === "cancelled") {
        throw new Error("El envío del correo fue cancelado.");
    }

    throw new Error(
        "El correo no se ha confirmado como enviado."
    );
};