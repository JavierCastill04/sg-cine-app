import { X } from "lucide-react-native";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";

import type { Funcion } from "../../../types/Funcion";
import type { Pelicula } from "../../../types/Pelicula";
import type { Sala } from "../../../types/Sala";

import AsientosSecciones from "../../../components/asientos/AsientosSecciones";
import { commonStyles, colores, espaciado } from "../../../theme";

interface FuncionDetalleModalProps {
    visible: boolean;
    funcion?: Funcion;
    pelicula?: Pelicula;
    sala?: Sala;
    onClose: () => void;
}

export default function FuncionDetalleModal({
    visible,
    funcion,
    pelicula,
    sala,
    onClose
}: FuncionDetalleModalProps) {
    if (!funcion || !pelicula || !sala) return null;

    const disponibles = funcion.estadoAsientos.filter(a => a.estado === "disponible").length;
    const reservados = funcion.estadoAsientos.filter(a => a.estado === "reservado").length;
    const seleccionados = funcion.estadoAsientos.filter(a => a.estado === "seleccionado").length;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={commonStyles.modalOverlay}>
                <View style={commonStyles.modal}>

                    <View style={styles.fila}>
                        <View>
                            <Text style={commonStyles.title}>#{funcion.id} - {pelicula.nombre} </Text>
                        </View>

                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={colores.texto} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.fila}>
                        <View style={styles.cuadro}>
                            <Text style={commonStyles.label}>Sala</Text>
                            <Text style={commonStyles.secondaryText}>{sala.nombre}</Text>
                        </View>

                        <View style={styles.cuadro}>
                            <Text style={commonStyles.label}>Fecha</Text>
                            <Text style={commonStyles.secondaryText}>{funcion.fecha}</Text>
                        </View>

                        <View style={styles.cuadro}>
                            <Text style={commonStyles.label}>Hora</Text>
                            <Text style={commonStyles.secondaryText}>{funcion.horaInicio}</Text>
                        </View>
                    </View>

                    <View style={[styles.fila, { marginBottom: espaciado.lg }]}>
                        <View style={styles.cuadro}>
                            <Text style={[commonStyles.label,{ color: colores.verde }]}>Disponibles</Text>
                            <Text style={[commonStyles.label,{ color: colores.verde }]}>{disponibles}</Text>
                        </View>

                        <View style={styles.cuadro}>
                            <Text style={[commonStyles.label,{ color: colores.rojo }]}>Reservados</Text>
                            <Text style={[commonStyles.label,{ color: colores.rojo }]}>{reservados}</Text>
                        </View>
                    </View>

                    <Text style={commonStyles.subtitle}>Estado de asientos</Text>

                    <AsientosSecciones
                        asientos={sala.asientos}
                        columnas={sala.capacidad.columnas}
                        estadoAsientos={funcion.estadoAsientos}
                        soloLectura
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fila: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: espaciado.sm,
        marginBottom: espaciado.md,
    },
    cuadro: {
        flex: 1,
        backgroundColor: colores.primario,
        borderRadius: 8,
        padding: espaciado.sm,
        alignItems: "center",
    }
});