export type CampoCliente = "nombre" | "correo" | "telefono";
export type FormDataCliente = Record<CampoCliente, string>;
export type FormErrorsCliente = Record<CampoCliente, string>;

export function validarCampo(
    campo: CampoCliente,
    valor: string
): string {
    const valorLimpio = valor.trim();

    switch (campo) {
        case "nombre":
            if (!valorLimpio) { return "El nombre es obligatorio"; }
            if (valorLimpio.length < 3) { return "El nombre debe tener al menos 3 caracteres"; }
            return "";

        case "correo":
            if (!valorLimpio) { return "El correo es obligatorio"; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valorLimpio)) { return "Ingresa un correo válido"; }
            return "";

        case "telefono":
            if (!valorLimpio) { return "El teléfono es obligatorio"; }
            if (!/^\d+$/.test(valorLimpio)) { return "El teléfono solo debe contener números"; }
            if (valorLimpio.length < 8) { return "El teléfono debe tener al menos 8 dígitos"; }
            return "";

        default:
            return "";
    }
}