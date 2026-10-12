import { useEffect, useState } from 'react';
import { X } from 'lucide-react-native';
import { Modal, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator, } from 'react-native';
import type { Funcion } from '../../../types/Funcion';
import type { EstadoAsiento } from '../../../types/EstadoAsiento';
import type { Pelicula } from '../../../types/Pelicula';
import type { Sala } from '../../../types/Sala';
import { funcionesService } from '../../../services/funciones.service';
import type { AsientosFuncion } from '../../../services/funciones.service';
import AsientosSecciones from '../../../components/asientos/AsientosSecciones';
import { commonStyles, colores, espaciado } from '../../../theme';

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
    onClose,
}: FuncionDetalleModalProps) {
    const [datosAsientos, setDatosAsientos] =
        useState<AsientosFuncion | null>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!visible || !funcion) return;

        let vigente = true;

        const cargarAsientos = async () => {
            setCargando(true);
            setError(null);
            setDatosAsientos(null);

            try {
                const respuesta = await funcionesService.obtenerAsientos(
                    funcion.id
                );

                if (vigente) setDatosAsientos(respuesta);
            } catch (e) {
                if (vigente) {
                    setError(
                        e instanceof Error
                            ? e.message
                            : 'No se pudieron cargar los asientos.'
                    );
                }
            } finally {
                if (vigente) setCargando(false);
            }
        };

        cargarAsientos();

        return () => {
            vigente = false;
        };
    }, [visible, funcion?.id]);

    if (!funcion || !pelicula || !sala) return null;

    const asientosReservados = new Set(
        datosAsientos?.asientos
            .filter(asiento => asiento.estado === "ocupado")
            .map(asiento => asiento.asiento) ?? []
    );

    const estadoAsientos: EstadoAsiento[] = sala.asientos.map(asiento => ({
        asientoId: asiento.id,
        estado: asientosReservados.has(asiento.id)
            ? 'reservado'
            : 'disponible',
    }));

    const reservados = estadoAsientos.filter(
        asiento => asiento.estado === 'reservado'
    ).length;

    const disponibles = estadoAsientos.length - reservados;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={commonStyles.modalOverlay}>
                <View style={commonStyles.modal}>
                    <View style={styles.fila}>
                        <View style={styles.titulo}>
                            <Text style={commonStyles.title}>
                                #{funcion.id} - {pelicula.nombre}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={onClose}>
                            <X size={32} color={colores.enfasis} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.fila}>
                        <View style={styles.cuadro}>
                            <Text style={commonStyles.label}>Sala</Text>
                            <Text style={commonStyles.secondaryText}>
                                {sala.nombre}
                            </Text>
                        </View>

                        <View style={styles.cuadro}>
                            <Text style={commonStyles.label}>Fecha</Text>
                            <Text style={commonStyles.secondaryText}>
                                {funcion.fecha}
                            </Text>
                        </View>

                        <View style={styles.cuadro}>
                            <Text style={commonStyles.label}>Hora</Text>
                            <Text style={commonStyles.secondaryText}>
                                {funcion.horaInicio}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.fila,
                            { marginBottom: espaciado.lg },
                        ]}
                    >
                        <View style={styles.cuadro}>
                            <Text
                                style={[
                                    commonStyles.label,
                                    { color: colores.verde },
                                ]}
                            >
                                Disponibles
                            </Text>
                            <Text
                                style={[
                                    commonStyles.label,
                                    { color: colores.verde },
                                ]}
                            >
                                {cargando ? '—' : disponibles}
                            </Text>
                        </View>

                        <View style={styles.cuadro}>
                            <Text
                                style={[
                                    commonStyles.label,
                                    { color: colores.rojo },
                                ]}
                            >
                                Reservados
                            </Text>
                            <Text
                                style={[
                                    commonStyles.label,
                                    { color: colores.rojo },
                                ]}
                            >
                                {cargando ? '—' : reservados}
                            </Text>
                        </View>
                    </View>

                    <Text style={commonStyles.subtitle}>
                        Estado de asientos
                    </Text>

                    {cargando ? (
                        <ActivityIndicator color={colores.enfasis} />
                    ) : error ? (
                        <Text style={commonStyles.errorText}>{error}</Text>
                    ) : datosAsientos ? (
                        <AsientosSecciones
                            asientos={sala.asientos}
                            columnas={datosAsientos.columnas}
                            estadoAsientos={estadoAsientos}
                            soloLectura
                        />
                    ) : null}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fila: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: espaciado.sm,
        marginBottom: espaciado.md,
    },
    titulo: {
        flex: 1,
    },
    cuadro: {
        flex: 1,
        backgroundColor: colores.primario,
        borderRadius: 8,
        padding: espaciado.sm,
        alignItems: 'center',
    },
});