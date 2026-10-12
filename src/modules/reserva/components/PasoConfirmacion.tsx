import { Text, View } from "react-native";
import type { Funcion } from "../../../types/Funcion";
import type { Pelicula } from "../../../types/Pelicula";
import type { Sala } from "../../../types/Sala";
import type { Usuario } from "../../../types/Usuario";
import { commonStyles, colores } from "../../../theme";

interface Props {
    pelicula: Pelicula;
    sala: Sala;
    funcion: Funcion;
    seleccionados: string[];
    usuario: Usuario;
    total: number;
}

export default function PasoConfirmacion({
    pelicula,
    sala,
    funcion,
    seleccionados,
    usuario,
    total
}: Props) {
    return (
        <>
            <Text style={commonStyles.subtitle}>
                Confirmar reserva
            </Text>

            <View style={commonStyles.card}>
                <Text style={commonStyles.cardTitle}>
                    {pelicula.nombre}
                </Text>
                <Text style={commonStyles.secondaryText}>
                    {sala.nombre}
                </Text>
                <Text style={commonStyles.secondaryText}>
                    {funcion.fecha} - {funcion.horaInicio}
                </Text>

                <Text style={styles.titulo}>Asientos</Text>
                <Text style={commonStyles.secondaryText}>
                    {seleccionados.join(", ")}
                </Text>

                <Text style={styles.titulo}>Usuario</Text>
                <Text style={commonStyles.secondaryText}>
                    {usuario.nombre}
                </Text>
                <Text style={commonStyles.secondaryText}>
                    {usuario.correo}
                </Text>

                <Text style={styles.total}>
                    {seleccionados.length} boleto(s) — ${total.toFixed(2)}
                </Text>
                <Text style={commonStyles.secondaryText}>
                    El total definitivo se confirmará al completar la reserva.
                </Text>
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