
import { useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Eye, X } from "lucide-react-native";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { cargarMisReservasThunk } from "../../../redux/thunks/reservasThunks";
import type { Venta } from "../../../types/Venta";
import { commonStyles, colores } from "../../../theme";
import Boleto from "../components/Boleto";

export default function BoletosScreen() {
    const dispatch = useAppDispatch();
    const ventas = useAppSelector(state => state.venta);

    const [ventaSeleccionada, setVentaSeleccionada] =
        useState<Venta | null>(null);

    useEffect(() => {
        dispatch(cargarMisReservasThunk());
    }, [dispatch]);

    const cerrarModal = () => {
        setVentaSeleccionada(null);
    };

    const renderVenta = ({ item }: { item: Venta }) => (
        <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>
                {item.peliculaNombre ?? "Película"}
            </Text>

            <Text style={commonStyles.secondaryText}>
                {item.cineNombre
                    ? `${item.cineNombre} · `
                    : ""}
                {item.salaNombre ?? "Sala no disponible"}
            </Text>

            <Text style={commonStyles.secondaryText}>
                {item.fechaHoraFuncion ?? "Fecha no disponible"}
            </Text>

            <Text style={commonStyles.secondaryText}>
                Asientos: {item.asientos.join(", ")}
            </Text>

            <Text
                style={[
                    commonStyles.secondaryText,
                    { marginTop: 5 },
                ]}
            >
                Total: ${item.total.toFixed(2)}
            </Text>

            <TouchableOpacity
                style={[
                    commonStyles.button,
                    { marginTop: 15, flexDirection: "row" },
                ]}
                onPress={() => setVentaSeleccionada(item)}
            >
                <Eye size={20} />
                <Text
                    style={[
                        commonStyles.buttonText,
                        { marginLeft: 8 },
                    ]}
                >
                    Ver boleto
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={commonStyles.containerScreen}>
            <FlatList
                data={ventas}
                keyExtractor={item => item.id.toString()}
                renderItem={renderVenta}
                ListEmptyComponent={
                    <Text style={commonStyles.secondaryText}>
                        No tienes boletos guardados.
                    </Text>
                }
            />

            <Modal
                visible={ventaSeleccionada !== null}
                transparent
                animationType="fade"
                onRequestClose={cerrarModal}
            >
                <View
                    style={[
                        commonStyles.modalOverlay,
                        { backgroundColor: "rgba(0, 0, 0, 0.8)" },
                    ]}
                >
                    <View
                        style={[
                            commonStyles.modal,
                            {
                                borderWidth: 2,
                                borderColor: colores.enfasis,
                            },
                        ]}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                marginBottom: 5,
                            }}
                        >
                            <TouchableOpacity onPress={cerrarModal}>
                                <X size={28} color={colores.enfasis} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {ventaSeleccionada && (
                                <Boleto venta={ventaSeleccionada} />
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}