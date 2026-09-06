import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Pelicula } from "../../../types/Pelicula";
import { colores, commonStyles } from "../../../theme";

interface CarteleraCardProps {
    pelicula: Pelicula,
    onVerFunciones: (pelicula: Pelicula) => void;
}

export default function CarteleraCard({ pelicula, onVerFunciones }: CarteleraCardProps) {
    return (
        <View style={[commonStyles.card, styles.card]}>
            <Text style={[commonStyles.cardTitle, styles.titulo]}>
                {pelicula.nombre}
            </Text>

            <View style={styles.etiquetasContainer}>
                <Text style={styles.etiqueta}>
                    {pelicula.clasificacion}
                </Text>

                <Text style={styles.etiqueta}>
                    {pelicula.genero}
                </Text>

                <Text style={styles.etiqueta}>
                    {pelicula.duracion} min
                </Text>
            </View>

            <View style={styles.separador} />

            <TouchableOpacity style={styles.boton} onPress={() => onVerFunciones(pelicula)}>
                <Text style={styles.botonTexto}>
                    Ver funciones
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 15,
        padding: 18,
        borderRadius: 15,
    },

    titulo: {
        fontSize: 21,
        fontWeight: "700",
        marginBottom: 20,
    },

    etiquetasContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 15,
    },

    etiqueta: {
        backgroundColor: colores.claro,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        color: colores.texto,
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
        overflow: "hidden",
    },

    separador: {
        height: 1,
        backgroundColor: colores.textoSecundario,
        marginVertical: 12,
    },

    boton: {
        ...commonStyles.button,
        alignSelf: "flex-end",
    },

    botonTexto: {
        fontSize: 13,
        fontWeight: "700",
    },
});