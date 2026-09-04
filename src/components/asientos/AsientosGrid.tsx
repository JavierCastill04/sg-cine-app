import { Armchair } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { obtenerLetraFila } from "./asientosUtils";
import { EstadoAsiento } from "../../types/EstadoAsiento";

interface SeatGridProps {
    filas: number;
    columnas: number;
    salaId?: number;
    estadoAsientos?: EstadoAsiento[];
    seleccionados?: string[];
    onSeleccionar?: (asiento: string) => void;
}

export default function AsientosGrid({
    filas,
    columnas,
    salaId,
    estadoAsientos = [],
    seleccionados = [],
    onSeleccionar,
}: SeatGridProps) {

    const asientos = Array.from(
        { length: filas * columnas },
        (_, index) => {
            const fila = Math.floor(index / columnas);
            const columna = index % columnas;
            const asientoId = `${salaId ?? ""}-${obtenerLetraFila(fila)}-${columna + 1}`;

            return {
                id: asientoId,
                fila,
                columna,
            };
        }
    );

    const manejarSelect = (asientoId: string) => { onSeleccionar?.(asientoId); };

    return (
        <View style={styles.grid}>
            {asientos.map((asiento) => {
                const estado = estadoAsientos.find(
                    (item) => item.asientoId === asiento.id
                );

                const seleccionado = seleccionados.includes(asiento.id);
                const reservado = estado?.estado === "reservado";

                return (
                    <TouchableOpacity
                        key={asiento.id}
                        style={[
                            styles.asiento,
                            {
                                width: `${100 / columnas}%`,
                            },
                            reservado && styles.reservado,
                            seleccionado && styles.seleccionado,
                        ]}
                        onPress={() => manejarSelect(asiento.id)}
                        disabled={reservado}
                        activeOpacity={0.7}
                    >
                        <Armchair
                            size={24}
                            color={reservado ? "#999" : "#000"}
                        />

                        <Text style={styles.texto}>
                            {obtenerLetraFila(asiento.fila)}
                            {asiento.columna + 1}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
    },

    asiento: {
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },

    texto: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: "600",
    },

    reservado: {
        opacity: 0.4,
    },

    seleccionado: {
        backgroundColor: "#dbeafe",
        borderRadius: 8,
    },
});