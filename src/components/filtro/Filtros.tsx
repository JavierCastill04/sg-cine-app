import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
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
    onEstadoChange: (estado: "todos" | "disponible" | "noDisponible") => void;
    generos: string[];
    clasificaciones: string[];
    salas: { id: number; nombre: string }[];
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
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const renderOpciones = (
        opciones: { id: string | number; nombre: string }[],
        seleccionado: string | number | null,
        onChange: (valor: any) => void,
        todos: string,
        todosValor: string | number | null = ""
    ) => {
        const datos = [
            { id: "todos", nombre: todos, valor: todosValor },
            ...opciones.map(opcion => ({ ...opcion, valor: opcion.id }))
        ];

        return (
            <FlatList
                horizontal
                data={datos}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.opciones}
                renderItem={({ item }) => {
                    const activo = seleccionado === item.valor;

                    return (
                        <Pressable
                            style={[styles.opcion, activo && styles.opcionActiva]}
                            onPress={() => onChange(item.valor)}
                        >
                            <Text style={[styles.textoOpcion, activo && styles.textoOpcionActivo]}>
                                {item.nombre}
                            </Text>
                        </Pressable>
                    );
                }}
            />
        );
    }

    return (
        <View style={styles.contenedor}>
            <TextInput
                value={busqueda}
                onChangeText={onBusquedaChange}
                placeholder="Buscar película..."
                placeholderTextColor={colores.textoSecundario}
                style={styles.input}
            />

            <Pressable style={styles.botonFiltros} onPress={() => setMostrarFiltros(!mostrarFiltros)}>
                <Text style={styles.textoBotonFiltros}>Filtros {mostrarFiltros ? "▲" : "▼"}</Text>
            </Pressable>

            {mostrarFiltros && (
                <View style={styles.contenedorFiltros}>
                    <Text style={styles.titulo}>Género</Text>
                    {renderOpciones(generos.map(genero => ({ id: genero, nombre: genero })), generoSeleccionado, onGeneroChange, "Todos")}

                    <Text style={styles.titulo}>Clasificación</Text>
                    {renderOpciones(clasificaciones.map(clasificacion => ({ id: clasificacion, nombre: clasificacion })), clasificacionSeleccionada, onClasificacionChange, "Todas")}

                    <Text style={styles.titulo}>Sala</Text>
                    {renderOpciones(salas.map(sala => ({ id: sala.id, nombre: sala.nombre })), salaSeleccionada, onSalaChange, "Todas", null)}

                    <Text style={styles.titulo}>Estado</Text>
                    {renderOpciones([
                        { id: "disponible", nombre: "Disponible" },
                        { id: "noDisponible", nombre: "No disponible" }
                    ], estadoSeleccionado, onEstadoChange, "Todos", "todos")}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: { marginBottom: 10 },
    input: {
        backgroundColor: colores.superficie,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        color: colores.texto,
        borderWidth: 1,
        borderColor: colores.borde,
        marginBottom: 8
    },
    botonFiltros: {
        backgroundColor: colores.secundario,
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: "center"
    },
    textoBotonFiltros: { color: colores.superficie, fontSize: 14, fontWeight: "700" },
    contenedorFiltros: {
        marginTop: 8,
        padding: 10,
        backgroundColor: colores.secundario,
        borderRadius: 10
    },
    titulo: {
        color: colores.superficie,
        fontSize: 14,
        fontWeight: "700",
        marginTop: 8,
        marginBottom: 6
    },
    opciones: { gap: 8, paddingRight: 10 },
    opcion: {
        paddingHorizontal: 13,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colores.secundario,
        borderWidth: 1,
        borderColor: colores.borde
    },
    opcionActiva: { backgroundColor: colores.enfasis, borderColor: colores.enfasis },
    textoOpcion: { color: colores.superficie, fontSize: 12, fontWeight: "600" },
    textoOpcionActivo: { color: colores.primario }
});