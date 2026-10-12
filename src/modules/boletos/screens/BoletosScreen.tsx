import { useCallback, useEffect, useState } from "react";
import { FlatList, Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View, } from "react-native";
import { Eye, X } from "lucide-react-native";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { cargarMisReservasThunk } from "../../../redux/thunks/reservasThunks";
import type { Venta } from "../../../types/Venta";
import { commonStyles, colores } from "../../../theme";
import { useCargaPantalla } from "../../../hooks/useCargaPantalla";
import EstadoPantalla from "../../../components/estadoPantalla/EstadoPantalla";
import Boleto from "../components/Boleto";

export default function BoletosScreen() {
    const dispatch = useAppDispatch();
    const ventas = useAppSelector(state => state.venta);

    const [ventaSeleccionada, setVentaSeleccionada] =
        useState<Venta | null>(null);

    const cargar = useCallback(async () => {
        await dispatch(cargarMisReservasThunk()).unwrap();
    }, [dispatch]);

    const {
        cargando,
        actualizando,
        error,
        datosCargados,
        actualizar,
        reintentar,
    } = useCargaPantalla({ cargar });

    useEffect(() => {
        void reintentar();
    }, [reintentar]);

    const cerrarModal = () => {
        setVentaSeleccionada(null);
    };

    const renderVenta = ({ item }: { item: Venta }) => (
        <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>
                {item.peliculaNombre ?? "Película"}
            </Text>

            <Text style={commonStyles.secondaryText}>
                {item.cineNombre ? `${item.cineNombre} · ` : ""}
                {item.salaNombre ?? "Sala no disponible"}
            </Text>

            <Text style={commonStyles.secondaryText}>
                {item.fechaHoraFuncion ?? "Fecha no disponible"}
            </Text>

            <Text style={commonStyles.secondaryText}>
                Asientos: {item.asientos.join(", ")}
            </Text>

            <Text style={[commonStyles.secondaryText, { marginTop: 5 }]}>
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
                <Text style={[commonStyles.buttonText, { marginLeft: 8 }]}>
                    Ver boleto
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <EstadoPantalla
            cargando={cargando}
            error={error}
            datosCargados={datosCargados}
            onReintentar={reintentar}
        >
            <View style={commonStyles.containerScreen}>
                <FlatList
                    data={ventas}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderVenta}
                    refreshControl={
                        <RefreshControl
                            refreshing={actualizando}
                            onRefresh={actualizar}
                            tintColor={colores.enfasis}
                            colors={[colores.enfasis]}
                        />
                    }
                    ListEmptyComponent={
                        <Text
                            style={[
                                commonStyles.secondaryText,
                                { textAlign: "center", marginTop: 20 },
                            ]}
                        >
                            No tienes boletos guardados.
                        </Text>
                    }
                    showsVerticalScrollIndicator={false}
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
                            {
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            },
                        ]}
                    >
                        <View
                            style={[
                                commonStyles.modal,
                                {
                                    width: "85%",
                                    maxHeight: "75%",
                                    padding: 16,
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

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 8 }}
                            >
                                {ventaSeleccionada && (
                                    <Boleto venta={ventaSeleccionada} />
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        </EstadoPantalla>
    );
}