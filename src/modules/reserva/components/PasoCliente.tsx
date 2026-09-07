import { useState } from "react";
import { Text, TextInput } from "react-native";
import { colores, commonStyles } from "../../../theme";
import type { Cliente } from "../../../types/Cliente";
import { validarCampo, type CampoCliente, type FormErrorsCliente } from "../validarCliente";

interface Props {
    cliente: Cliente;
    onChange: (campo: keyof Cliente, valor: string) => void;
}

export default function PasoCliente({ cliente, onChange }: Props) {
    const [tocados, setTocados] = useState<Record<CampoCliente, boolean>>({
        nombre: false,
        correo: false,
        telefono: false
    });

    const [errores, setErrores] = useState<FormErrorsCliente>({
        nombre: "",
        correo: "",
        telefono: ""
    });

    const cambiarCampo = (
        campo: CampoCliente,
        valor: string
    ) => {
        onChange(campo, valor);

        if (tocados[campo]) {
            setErrores(actual => ({
                ...actual,
                [campo]: validarCampo(campo, valor)
            }));
        }
    };

    const tocarCampo = (campo: CampoCliente) => {
        setTocados(actual => ({
            ...actual,
            [campo]: true
        }));

        setErrores(actual => ({
            ...actual,
            [campo]: validarCampo(campo, cliente[campo])
        }));
    };

    return (
        <>
            <Text style={commonStyles.subtitle}>Datos del cliente</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={[
                    commonStyles.input,
                    tocados.nombre &&
                    errores.nombre &&
                    commonStyles.errorInput
                ]}
                value={cliente.nombre}
                onChangeText={valor => onChange("nombre", valor)}
                onBlur={() => tocarCampo("nombre")}
                placeholder="Nombre completo"
                placeholderTextColor={colores.textoSecundario}

            />

            {tocados.nombre && errores.nombre !== "" && (
                <Text style={commonStyles.errorText}>
                    {errores.nombre}
                </Text>
            )}

            <Text style={styles.label}>Correo</Text>
            <TextInput
                style={[
                    commonStyles.input,
                    tocados.correo &&
                    errores.correo &&
                    commonStyles.errorInput
                ]}
                value={cliente.correo}
                onChangeText={valor => onChange("correo", valor)}
                onBlur={() => tocarCampo("correo")}
                placeholder="correo@ejemplo.com"
                placeholderTextColor={colores.textoSecundario}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {tocados.correo && errores.correo !== "" && (
                <Text style={commonStyles.errorText}>
                    {errores.correo}
                </Text>
            )}

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
                style={[
                    commonStyles.input,
                    tocados.telefono &&
                    errores.telefono &&
                    commonStyles.errorInput
                ]}
                value={cliente.telefono}
                onChangeText={valor => onChange("telefono", valor.slice(0,8))}
                onBlur={() => tocarCampo("telefono")}
                placeholder="Número de teléfono"
                placeholderTextColor={colores.textoSecundario}
                keyboardType="phone-pad"
            />

            {tocados.telefono && errores.telefono !== "" && (
                <Text style={commonStyles.errorText}>
                    {errores.telefono}
                </Text>
            )}
        </>
    );
}

const styles = {
    label: {
        color: colores.superficie,
        fontSize: 14,
        fontWeight: "600" as const,
        marginTop: 12,
        marginBottom: 6
    }
};