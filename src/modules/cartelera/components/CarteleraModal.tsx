import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { X, CalendarDays, Clock } from "lucide-react-native";
import { Pelicula } from "../../../types/Pelicula";
import { colores, commonStyles } from "../../../theme";
import { useAppSelector } from "../../../redux/hooks";

interface FuncionesModalProps {
    visible: boolean;
    pelicula: Pelicula | null;
    onClose: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CarteleraModal({ visible, pelicula, onClose }: FuncionesModalProps) {

    const navigation = useNavigation<NavigationProp>();
    const funciones = useAppSelector((state) => state.funcion);
    if (!pelicula) return null;

    const funcionesPelicula = funciones.filter((funcion) => funcion.peliculaId === pelicula.id);

    const seleccionarFuncion = (funcionId: number) => {
        onClose();
        navigation.navigate("Reserva", { funcionId });
    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={commonStyles.modalOverlay}>
                <View style={commonStyles.modal}>

                    <View style={styles.header}>
                        <Text style={styles.titulo} numberOfLines={1}>{pelicula.nombre}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={30} color={colores.enfasis} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={styles.etiquetas}>
                            <Text style={styles.etiqueta}>{pelicula.clasificacion}</Text>
                            <Text style={styles.etiqueta}>{pelicula.genero}</Text>
                            <Text style={styles.etiqueta}>{pelicula.duracion} min</Text>
                        </View>

                        <Text style={styles.subtitulo}>Funciones disponibles</Text>

                        {funcionesPelicula.map((funcion) => (
                            <TouchableOpacity key={funcion.id} style={styles.funcion} onPress={() => seleccionarFuncion(funcion.id)}>
                                <View style={styles.dato}>
                                    <CalendarDays size={18} color={colores.enfasis} />
                                    <Text style={styles.texto}>{funcion.fecha}</Text>
                                </View>

                                <View style={styles.dato}>
                                    <Clock size={18} color={colores.enfasis} />
                                    <Text style={styles.texto}>{funcion.horaInicio}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15,
    },
    titulo: {
        flex: 1,
        color: colores.enfasis,
        fontSize: 20,
        fontWeight: "700",
        marginRight: 10,
    },
    subtitulo: {
        color: colores.superficie,
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 5,
    },
    etiquetas: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
    },
    etiqueta: {
        backgroundColor: colores.superficie,
        color: colores.texto,
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        fontSize: 12,
        fontWeight: "600",
    },
    funcion: {
        backgroundColor: colores.fondo,
        borderRadius: 12,
        padding: 15,
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    dato: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    texto: {
        color: colores.superficie,
        fontSize: 14,
    },
});