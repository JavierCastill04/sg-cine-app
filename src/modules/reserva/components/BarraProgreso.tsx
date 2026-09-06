import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { colores } from "../../../theme";

interface Props {
    paso: number;
    pasos: string[];
}

export default function BarraProgreso({ paso, pasos }: Props) {
    const progresoAnimado = useRef(new Animated.Value((1 / pasos.length) * 100)).current;

    useEffect(() => {
        Animated.timing(progresoAnimado, {
            toValue: (paso / pasos.length) * 100,
            duration: 400,
            useNativeDriver: false
        }).start();
    }, [paso, pasos.length]);

    return (
        <View>
            <View style={styles.progreso}>
                <Animated.View
                    style={[
                        styles.progresoActivo,
                        {
                            width: progresoAnimado.interpolate({
                                inputRange: [0, 100],
                                outputRange: ["0%", "100%"]
                            })
                        }
                    ]}
                />
            </View>

            <Text style={styles.texto}>
                Paso {paso} de {pasos.length}: {pasos[paso - 1]}
            </Text>
        </View>
    );
}

const styles = {
    progreso: {
        height: 6,
        backgroundColor: colores.superficie,
        borderRadius: 3,
        overflow: "hidden" as const,
        marginBottom: 8,
        marginTop: 20
    },

    progresoActivo: {
        height: "100%" as const,
        backgroundColor: colores.enfasis,
        borderRadius: 3
    },

    texto: {
        color: colores.superficie,
        fontSize: 13,
        textAlign: "center" as const,
        marginBottom: 20
    }
};