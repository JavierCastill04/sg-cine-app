import { useEffect, useRef } from "react";
import { Animated } from "react-native";

interface Props {
    paso: number;
    children: React.ReactNode;
}

export default function PasoContainer({
    paso,
    children
}: Props) {
    const opacidad = useRef(new Animated.Value(1)).current;
    const desplazamiento = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        opacidad.setValue(0);
        desplazamiento.setValue(15);

        Animated.parallel([
            Animated.timing(opacidad, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true
            }),

            Animated.timing(desplazamiento, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            })
        ]).start();
    }, [paso]);

    return (
        <Animated.View
            style={{
                opacity: opacidad,
                transform: [
                    { translateX: desplazamiento }
                ]
            }}
        >
            {children}
        </Animated.View>
    );
}