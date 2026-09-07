import { useState } from "react";
import { Armchair, ArrowLeft } from "lucide-react-native";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Asiento } from "../../types/Asiento";
import type { EstadoAsiento } from "../../types/EstadoAsiento";
import type { Seccion } from "../../types/Seccion";
import { commonStyles, colores } from "../../theme";
import { styles } from "./AsientosSeccionesStyles";

interface AsientosSeccionesProps {
    asientos: Asiento[];
    columnas: number;
    estadoAsientos?: EstadoAsiento[];
    seleccionados?: string[];
    onSeleccionar?: (asientoId: string) => void;
    soloLectura?: boolean;
    mostrarSeleccionados?: boolean;
}

export default function AsientosSecciones({
    asientos,
    columnas,
    estadoAsientos = [],
    seleccionados = [],
    onSeleccionar,
    soloLectura = false,
    mostrarSeleccionados = false
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
                        <ArrowLeft size={32} color={colores.texto} />
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
                            <Text style={commonStyles.secondaryText}> {seccion.asientos.length} asientos </Text>
                            <Text style={{ color: colores.verde }}> {disponibles} disponibles</Text>
                            <Text style={{ color: colores.rojo }}>{seccion.asientos.length - disponibles} reservados</Text>
                            {mostrarSeleccionados && (
                                <Text style={styles.seleccionados}>
                                    Seleccionados:{" "}
                                    {seccion.asientos
                                        .filter(asiento => seleccionados.includes(asiento.id))
                                        .map(asiento =>
                                            `${asiento.ubicacion.letraFila}${asiento.ubicacion.columna}`
                                        )
                                        .join(", ") || "Ninguno"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}