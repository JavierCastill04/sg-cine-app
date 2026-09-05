import { useState } from "react";
import { Armchair, ArrowLeft } from "lucide-react-native";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Asiento } from "../../types/Asiento";
import type { EstadoAsiento } from "../../types/EstadoAsiento";
import { commonStyles, colores, espaciado } from "../../theme";

interface AsientosSeccionesProps {
    asientos: Asiento[];
    columnas: number;
    estadoAsientos?: EstadoAsiento[];
    seleccionados?: string[];
    onSeleccionar?: (asientoId: string) => void;
    soloLectura?: boolean;
}

interface Seccion {
    id: string;
    nombre: string;
    asientos: Asiento[];
    columnas: number;
}

export default function AsientosSecciones({
    asientos,
    columnas,
    estadoAsientos = [],
    seleccionados = [],
    onSeleccionar,
    soloLectura = false
}: AsientosSeccionesProps) {
    const [seccionSeleccionada, setSeccionSeleccionada] = useState<Seccion>();
    const filas = Math.ceil(asientos.length / columnas);
    const mitadFilas = Math.ceil(filas / 2);
    const mitadColumnas = Math.ceil(columnas / 2);

    const secciones: Seccion[] = [
        { id: "A", nombre: "Sección A", asientos: [], columnas: mitadColumnas },
        { id: "B", nombre: "Sección B", asientos: [], columnas: columnas - mitadColumnas },
        { id: "C", nombre: "Sección C", asientos: [], columnas: mitadColumnas },
        { id: "D", nombre: "Sección D", asientos: [], columnas: columnas - mitadColumnas }
    ];

    asientos.forEach((asiento, index) => {
        const fila = Math.floor(index / columnas);
        const columna = index % columnas;
        const indice = fila < mitadFilas
            ? columna < mitadColumnas ? 0 : 1
            : columna < mitadColumnas ? 2 : 3;

        secciones[indice].asientos.push(asiento);
    });

    const estados = new Map(estadoAsientos.map(a => [a.asientoId, a.estado]));

    if (seccionSeleccionada) {
        return (
            <View>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.volver} onPress={() => setSeccionSeleccionada(undefined)}>
                        <ArrowLeft size={24} color={colores.texto} />
                        <Text style={commonStyles.labelBlack}>Volver</Text>
                    </TouchableOpacity>

                    <Text style={styles.tituloSeccion}>
                        {seccionSeleccionada.nombre}
                    </Text>

                    <View style={styles.espacioHeader} />
                </View>

                <View style={styles.mapaAsientos}>
                    <ScrollView horizontal showsHorizontalScrollIndicator>
                        <FlatList
                            key={seccionSeleccionada.id}
                            data={seccionSeleccionada.asientos}
                            keyExtractor={a => a.id}
                            numColumns={seccionSeleccionada.columnas}
                            contentContainerStyle={styles.grid}
                            showsVerticalScrollIndicator
                            renderItem={({ item }) => {
                                const estado = estados.get(item.id) ?? "disponible";
                                const seleccionado =
                                    seleccionados.includes(item.id) ||
                                    estado === "seleccionado";
                                const reservado = estado === "reservado";

                                const color = reservado
                                    ? colores.rojo
                                    : seleccionado
                                        ? colores.enfasis
                                        : colores.verde;

                                const contenido = (
                                    <>
                                        <Armchair size={32} color={color} />
                                        <Text style={commonStyles.secondaryText}>
                                            {item.ubicacion.letraFila}{item.ubicacion.columna}
                                        </Text>
                                    </>
                                );

                                if (soloLectura) {
                                    return <View style={styles.asiento}>{contenido}</View>;
                                }

                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.asiento,
                                            reservado && styles.reservado,
                                            seleccionado && styles.seleccionado
                                        ]}
                                        onPress={() => onSeleccionar?.(item.id)}
                                        disabled={reservado}
                                        activeOpacity={0.7}
                                    >
                                        {contenido}
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </ScrollView>
                </View>

                <View style={styles.leyenda}>
                    <View style={styles.estado}>
                        <Armchair size={18} color={colores.verde} />
                        <Text style={commonStyles.secondaryText}>Disponible</Text>
                    </View>

                    <View style={styles.estado}>
                        <Armchair size={18} color={colores.rojo} />
                        <Text style={commonStyles.secondaryText}>Reservado</Text>
                    </View>

                    <View style={styles.estado}>
                        <Armchair size={18} color={colores.enfasis} />
                        <Text style={commonStyles.secondaryText}>Seleccionado</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View>
            <View style={styles.pantalla}>
                <Text style={commonStyles.text}>PANTALLA</Text>
            </View>

            <View style={styles.mapa}>
                {secciones.filter(s => s.asientos.length).map(seccion => {
                    const disponibles = seccion.asientos.filter(
                        a => (estados.get(a.id) ?? "disponible") === "disponible"
                    ).length;

                    return (
                        <TouchableOpacity
                            key={seccion.id}
                            style={[commonStyles.card, styles.seccion]}
                            onPress={() => setSeccionSeleccionada(seccion)}
                            activeOpacity={0.7}
                        >
                            <Text style={commonStyles.cardTitle}>{seccion.nombre}</Text>
                            <Text style={commonStyles.secondaryText}>
                                {seccion.asientos.length} asientos
                            </Text>
                            <Text style={{ color: colores.verde }}>
                                {disponibles} disponibles
                            </Text>
                            <Text style={{ color: colores.rojo }}>
                                {seccion.asientos.length - disponibles} reservados
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pantalla: {
        height: 42,
        backgroundColor: colores.primario,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: espaciado.lg
    },
    mapa: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: espaciado.md
    },
    seccion: {
        width: "48%",
        minHeight: 135,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: espaciado.md
    },
    volver: {
        flexDirection: "row",
        backgroundColor:colores.enfasis,
        borderRadius: 25,
        alignItems: "center",
        gap: 3,
        paddingVertical:espaciado.xs,
        paddingRight: espaciado.md
    },
    tituloSeccion: {
        ...commonStyles.heading,
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center"
    },
    espacioHeader: {
        width: 65
    },
    mapaAsientos: {
        height: 360,
        borderColor: colores.enfasis,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: colores.secundario,
        overflow: "hidden"
    },
    grid: {
        padding: espaciado.md,
        alignSelf: "center"
    },
    asiento: {
        width: 70,
        height: 70,
        margin: 6,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    reservado: {
        opacity: 0.45
    },
    seleccionado: {
        backgroundColor: colores.enfasis,
        borderWidth: 1,
        borderColor: colores.enfasis
    },
    leyenda: {
        flexDirection: "row",
        justifyContent: "center",
        gap: espaciado.lg,
        marginTop: espaciado.md
    },
    estado: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    }
});