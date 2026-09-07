import { Text, View } from "react-native";
import type { Funcion } from "../../../types/Funcion";
import type { Pelicula } from "../../../types/Pelicula";
import type { Sala } from "../../../types/Sala";
import { commonStyles, colores } from "../../../theme";

interface Cliente {
    nombre: string;
    correo: string;
    telefono: string;
}

interface Props {
    pelicula: Pelicula;
    sala: Sala;
    funcion: Funcion;
    seleccionados: string[];
    cliente: Cliente;
    total: number;
}

export default function PasoConfirmacion({
    pelicula,
    sala,
    funcion,
    seleccionados,
    cliente,
    total
}: Props) {
    return (
        <>
            <Text style={commonStyles.subtitle}>
                Confirmar reserva
            </Text>

            <View style={commonStyles.card}>
                <Text style={commonStyles.cardTitle}>{pelicula.nombre}</Text>
                <Text style={commonStyles.secondaryText}>{sala.nombre}</Text>
                <Text style={commonStyles.secondaryText}>{funcion.fecha} - {funcion.horaInicio}</Text>
                <Text style={styles.titulo}>Asientos</Text>
                <Text style={commonStyles.secondaryText}>{seleccionados.join(", ")}</Text>
                <Text style={styles.titulo}>Cliente </Text>
                <Text style={commonStyles.secondaryText}>{cliente.nombre}</Text>
                <Text style={commonStyles.secondaryText}>{cliente.correo}</Text>
                <Text style={commonStyles.secondaryText}>{cliente.telefono}</Text>
                <Text style={styles.total}>{seleccionados.length} boleto(s) — ${total.toFixed(2)}</Text>
            </View>
        </>
    );
}

const styles = {
    titulo: {
        color: colores.enfasis,
        fontSize: 15,
        fontWeight: "700" as const,
        marginTop: 15,
        marginBottom: 5
    },
    total: {
        color: colores.enfasis,
        fontSize: 18,
        fontWeight: "700" as const,
        marginTop: 12
    }
};