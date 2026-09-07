import { Text, View } from "react-native";
import type { Funcion } from "../../../types/Funcion";
import type { Pelicula } from "../../../types/Pelicula";
import type { Sala } from "../../../types/Sala";
import { commonStyles } from "../../../theme";

interface Props {
    pelicula: Pelicula;
    sala: Sala;
    funcion: Funcion;
}

export default function PasoFuncion({ pelicula, sala, funcion }: Props) {
    return (
        <>
            <Text style={commonStyles.subtitle}>{pelicula.nombre}</Text>

            <View style={commonStyles.card}>
                <Text style={commonStyles.cardTitle}>{sala.nombre}</Text>
                <Text style={commonStyles.secondaryText}>
                    Fecha: {funcion.fecha}
                </Text>
                <Text style={commonStyles.secondaryText}>
                    Hora: {funcion.horaInicio}
                </Text>
                <Text style={commonStyles.secondaryText}>
                    Precio: ${pelicula.precio.toFixed(2)}
                </Text>
            </View>
        </>
    );
}