import { Text, TextInput } from "react-native";
import { colores, commonStyles } from "../../../theme";
import type { Cliente } from "../../../types/Cliente";

interface Props {
    cliente: Cliente;
    onChange: (campo: keyof Cliente, valor: string) => void;
}

export default function PasoCliente({ cliente, onChange }: Props) {
    return (
        <>
            <Text style={commonStyles.subtitle}>Datos del cliente</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
                style={commonStyles.input}
                value={cliente.nombre}
                onChangeText={valor => onChange("nombre", valor)}
                placeholder="Nombre completo"
                placeholderTextColor={colores.textoSecundario}
            />

            <Text style={styles.label}>Correo</Text>
            <TextInput
                style={commonStyles.input}
                value={cliente.correo}
                onChangeText={valor => onChange("correo", valor)}
                placeholder="correo@ejemplo.com"
                placeholderTextColor={colores.textoSecundario}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
                style={commonStyles.input}
                value={cliente.telefono}
                onChangeText={valor => onChange("telefono", valor)}
                placeholder="Número de teléfono"
                placeholderTextColor={colores.textoSecundario}
                keyboardType="phone-pad"
            />
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