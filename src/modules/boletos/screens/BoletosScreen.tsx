import { useState } from "react";
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Eye, X } from "lucide-react-native";
import { useAppSelector } from "../../../redux/hooks";
import type { Venta } from "../../../types/Venta";
import { commonStyles, colores } from "../../../theme";
import Boleto from "../components/Boleto";

export default function BoletosScreen() {
    const ventas = useAppSelector(state => state.venta);
    const funciones = useAppSelector(state => state.funcion);
    const peliculas = useAppSelector(state => state.pelicula);
    const salas = useAppSelector(state => state.sala);

    const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);
    const cerrarModal = () => { setVentaSeleccionada(null); };

    const renderVenta = ({ item }: { item: Venta }) => {
        const funcion = funciones.find(funcion => funcion.id === item.funcionId);
        const pelicula = funcion ? peliculas.find(pelicula => pelicula.id === funcion.peliculaId) : null;
        const sala = funcion ? salas.find(sala => sala.id === funcion.salaId) : null;

        if (!funcion || !pelicula || !sala) {
            return null;
        }

        return (
            <View style={commonStyles.card}>
                <Text style={commonStyles.cardTitle}>{pelicula.nombre}</Text>
                <Text style={commonStyles.secondaryText}>{sala.nombre}</Text>
                <Text style={commonStyles.secondaryText}>{funcion.fecha} - {funcion.horaInicio}</Text>
                <Text style={[commonStyles.secondaryText, { marginTop: 5 }]}>Total: ${item.total.toFixed(2)}</Text>
                <TouchableOpacity
                    style={[commonStyles.button, { marginTop: 15, flexDirection: "row" }]}
                    onPress={() => setVentaSeleccionada(item)}
                >
                    <Eye size={20} />
                    <Text style={[commonStyles.buttonText, { marginLeft: 8 }]}>Ver boleto</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const venta = ventaSeleccionada;

    const funcion = venta
        ? funciones.find(funcion => funcion.id === venta.funcionId)
        : null;

    const pelicula = funcion
        ? peliculas.find(pelicula => pelicula.id === funcion.peliculaId)
        : null;

    const sala = funcion
        ? salas.find(sala => sala.id === funcion.salaId)
        : null;

    return (
        <View style={commonStyles.containerScreen}>
            <FlatList
                data={ventas}
                keyExtractor={item => item.id.toString()}
                renderItem={renderVenta}
                ListEmptyComponent={
                    <Text style={commonStyles.secondaryText}>No tienes boletos comprados.</Text>
                }
            />

            <Modal visible={venta !== null} transparent animationType="fade" onRequestClose={cerrarModal}>
                <View style={[commonStyles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.8)" }]}>
                    <View style={[commonStyles.modal, { borderWidth: 2, borderColor: colores.enfasis }]}>
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 5 }}>
                            <TouchableOpacity onPress={cerrarModal}>
                                <X size={28} color={colores.enfasis} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {venta && funcion && pelicula && sala && (
                                <Boleto
                                    venta={venta}
                                    funcion={funcion}
                                    pelicula={pelicula}
                                    sala={sala}
                                />
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal >
        </View >
    );
}