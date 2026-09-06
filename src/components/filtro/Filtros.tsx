import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { colores } from "../../theme";

interface FiltrosProps {
    busqueda: string;
    onBusquedaChange: (texto: string) => void;

    generoSeleccionado: string;
    onGeneroChange: (genero: string) => void;

    clasificacionSeleccionada: string;
    onClasificacionChange: (clasificacion: string) => void;

    salaSeleccionada: number | null;
    onSalaChange: (salaId: number | null) => void;

    estadoSeleccionado: "todos" | "disponible" | "noDisponible";
    onEstadoChange: (
        estado: "todos" | "disponible" | "noDisponible"
    ) => void;

    generos: string[];
    clasificaciones: string[];
    salas: {
        id: number;
        nombre: string;
    }[];
}

export default function Filtros({
    busqueda,
    onBusquedaChange,
    generoSeleccionado,
    onGeneroChange,
    clasificacionSeleccionada,
    onClasificacionChange,
    salaSeleccionada,
    onSalaChange,
    estadoSeleccionado,
    onEstadoChange,
    generos,
    clasificaciones,
    salas,
}: FiltrosProps) {
    return (
        <View style={styles.contenedor}>
            <TextInput
                value={busqueda}
                onChangeText={onBusquedaChange}
                placeholder="Buscar película..."
                placeholderTextColor={colores.textoSecundario}
                style={styles.input}
            />

            <Text style={styles.titulo}>Género</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.opciones}
            >
                <Pressable
                    style={[
                        styles.opcion,
                        generoSeleccionado === "" && styles.opcionActiva,
                    ]}
                    onPress={() => onGeneroChange("")}
                >
                    <Text
                        style={[
                            styles.textoOpcion,
                            generoSeleccionado === "" &&
                                styles.textoOpcionActivo,
                        ]}
                    >
                        Todos
                    </Text>
                </Pressable>

                {generos.map((genero) => (
                    <Pressable
                        key={genero}
                        style={[
                            styles.opcion,
                            generoSeleccionado === genero &&
                                styles.opcionActiva,
                        ]}
                        onPress={() => onGeneroChange(genero)}
                    >
                        <Text
                            style={[
                                styles.textoOpcion,
                                generoSeleccionado === genero &&
                                    styles.textoOpcionActivo,
                            ]}
                        >
                            {genero}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            <Text style={styles.titulo}>Clasificación</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.opciones}
            >
                <Pressable
                    style={[
                        styles.opcion,
                        clasificacionSeleccionada === "" &&
                            styles.opcionActiva,
                    ]}
                    onPress={() => onClasificacionChange("")}
                >
                    <Text
                        style={[
                            styles.textoOpcion,
                            clasificacionSeleccionada === "" &&
                                styles.textoOpcionActivo,
                        ]}
                    >
                        Todas
                    </Text>
                </Pressable>

                {clasificaciones.map((clasificacion) => (
                    <Pressable
                        key={clasificacion}
                        style={[
                            styles.opcion,
                            clasificacionSeleccionada === clasificacion &&
                                styles.opcionActiva,
                        ]}
                        onPress={() =>
                            onClasificacionChange(clasificacion)
                        }
                    >
                        <Text
                            style={[
                                styles.textoOpcion,
                                clasificacionSeleccionada === clasificacion &&
                                    styles.textoOpcionActivo,
                            ]}
                        >
                            {clasificacion}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            <Text style={styles.titulo}>Sala</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.opciones}
            >
                <Pressable
                    style={[
                        styles.opcion,
                        salaSeleccionada === null && styles.opcionActiva,
                    ]}
                    onPress={() => onSalaChange(null)}
                >
                    <Text
                        style={[
                            styles.textoOpcion,
                            salaSeleccionada === null &&
                                styles.textoOpcionActivo,
                        ]}
                    >
                        Todas
                    </Text>
                </Pressable>

                {salas.map((sala) => (
                    <Pressable
                        key={sala.id}
                        style={[
                            styles.opcion,
                            salaSeleccionada === sala.id &&
                                styles.opcionActiva,
                        ]}
                        onPress={() => onSalaChange(sala.id)}
                    >
                        <Text
                            style={[
                                styles.textoOpcion,
                                salaSeleccionada === sala.id &&
                                    styles.textoOpcionActivo,
                            ]}
                        >
                            {sala.nombre}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            <Text style={styles.titulo}>Estado</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.opciones}
            >
                <Pressable
                    style={[
                        styles.opcion,
                        estadoSeleccionado === "todos" &&
                            styles.opcionActiva,
                    ]}
                    onPress={() => onEstadoChange("todos")}
                >
                    <Text
                        style={[
                            styles.textoOpcion,
                            estadoSeleccionado === "todos" &&
                                styles.textoOpcionActivo,
                        ]}
                    >
                        Todos
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.opcion,
                        estadoSeleccionado === "disponible" &&
                            styles.opcionActiva,
                    ]}
                    onPress={() => onEstadoChange("disponible")}
                >
                    <Text
                        style={[
                            styles.textoOpcion,
                            estadoSeleccionado === "disponible" &&
                                styles.textoOpcionActivo,
                        ]}
                    >
                        Disponible
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.opcion,
                        estadoSeleccionado === "noDisponible" &&
                            styles.opcionActiva,
                    ]}
                    onPress={() => onEstadoChange("noDisponible")}
                >
                    <Text
                        style={[
                            styles.textoOpcion,
                            estadoSeleccionado === "noDisponible" &&
                                styles.textoOpcionActivo,
                        ]}
                    >
                        No disponible
                    </Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        marginBottom: 10,
    },

    input: {
        backgroundColor: colores.superficie,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        color: colores.texto,
        borderWidth: 1,
        borderColor: colores.borde,
        marginBottom: 12,
    },

    titulo: {
        color: colores.superficie,
        fontSize: 14,
        fontWeight: "700",
        marginTop: 8,
        marginBottom: 6,
    },

    opciones: {
        gap: 8,
        paddingRight: 10,
    },

    opcion: {
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colores.secundario,
        borderWidth: 1,
        borderColor: colores.borde,
    },

    opcionActiva: {
        backgroundColor: colores.enfasis,
        borderColor: colores.enfasis,
    },

    textoOpcion: {
        color: colores.superficie,
        fontSize: 12,
        fontWeight: "600",
    },

    textoOpcionActivo: {
        color: colores.primario,
    },
});