import { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, } from "react-native";
import { Sparkles } from "lucide-react-native";
import { Pelicula } from "../../../types/Pelicula";
import { colores, commonStyles } from "../../../theme";

const { width } = Dimensions.get("window");

interface CarteleraSliderProps {
    peliculasDestacadas: Pelicula[];
    onVerFunciones: (pelicula: Pelicula) => void;
}

export default function CarteleraSlider({
    peliculasDestacadas,
    onVerFunciones,
}: CarteleraSliderProps) {

    const scrollRef = useRef<ScrollView>(null);
    const [indiceActual, setIndiceActual] = useState(0);

    useEffect(() => {
        if (peliculasDestacadas.length <= 1) return;

        const intervalo = setInterval(() => {
            setIndiceActual((actual) => {
                const siguiente =
                    (actual + 1) % peliculasDestacadas.length;

                scrollRef.current?.scrollTo({
                    x: siguiente * width,
                    animated: true,
                });

                return siguiente;
            });
        }, 6000);

        return () => clearInterval(intervalo);
    }, [peliculasDestacadas.length]);

    const cambiarSlide = (event: any) => {
        const posicionX = event.nativeEvent.contentOffset.x;
        const nuevoIndice = Math.round(posicionX / width);
        setIndiceActual(nuevoIndice);
    };

    if (peliculasDestacadas.length === 0) { return null; }

    return (
        <View style={styles.container}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={cambiarSlide}
                decelerationRate="fast"
            >
                {peliculasDestacadas.map((pelicula) => (
                    <View key={pelicula.id} style={styles.slide}>
                        <View style={styles.card}>
                            <View style={styles.informacion}>
                                <View style={styles.destacadaContainer}>
                                    <Sparkles size={14} color={colores.enfasis} />
                                    <Text style={styles.destacada}>DESTACADA</Text>
                                </View>

                                <Text style={commonStyles.cardTitle} numberOfLines={1}>
                                    {pelicula.nombre}
                                </Text>

                                <Text style={styles.detalles}>
                                    {pelicula.clasificacion} ·{" "} {pelicula.genero} ·{" "}{pelicula.duracion} min
                                </Text>
                            </View>

                            <TouchableOpacity style={commonStyles.button} onPress={() => onVerFunciones(pelicula)}>
                                <Text style={styles.botonTexto}>Ver funciones</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.indicadores}>
                {peliculasDestacadas.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicador,
                            index === indiceActual &&
                            styles.indicadorActivo,
                        ]}
                    />
                ))}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 25,
    },

    slide: {
        width: width,
        paddingHorizontal: 25,
        transform: [{ translateX: -25 }],
    },

    card: {
        minHeight: 110,
        backgroundColor: colores.textoSecundario,
        borderRadius: 15,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        borderLeftWidth: 4,
        borderLeftColor: colores.enfasis,
        marginBottom: 10,
    },

    informacion: {
        flex: 1,
        marginRight: 10,
    },

    destacadaContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 5,
    },

    destacada: {
        color: colores.enfasis,
        fontSize: 11,
        fontWeight: "700",
    },

    detalles: {
        color: colores.superficie,
        fontSize: 12,
    },

    botonTexto: {
        color: "#000",
        fontSize: 12,
        fontWeight: "700",
    },

    indicadores: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        gap: 6,
    },

    indicador: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#555",
    },

    indicadorActivo: {
        width: 18,
        backgroundColor: colores.enfasis,
    },
});