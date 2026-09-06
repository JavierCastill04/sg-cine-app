import { ScrollView, Text, View } from "react-native";
import { useAppSelector } from "../../../redux/hooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import AsientosGrid from "../../../components/asientos/AsientosGrid";

type Props = NativeStackScreenProps<RootStackParamList, "Reserva">;

export default function ReservaScreen({ route }: Props) {

    const { funcionId } = route.params;

    const funcion = useAppSelector(
        (state) => state.funcion.find((f) => f.id === funcionId)
    );

    const pelicula = useAppSelector(
        (state) => state.pelicula.find(
            (p) => p.id === funcion?.peliculaId
        )
    );

    const sala = useAppSelector(
        (state) => state.sala.find(
            (s) => s.id === funcion?.salaId
        )
    );

    if (!funcion || !pelicula || !sala) {
        return (
            <View>
                <Text>No se encontró la función.</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <Text>{pelicula.nombre}</Text>
            <Text>{sala.nombre}</Text>
            <Text>{funcion.fecha}</Text>
            <Text>{funcion.horaInicio}</Text>
            <Text>Precio: ${pelicula.precio}</Text>

            <AsientosGrid
                filas={sala.capacidad.filas}
                columnas={sala.capacidad.columnas}
                salaId={sala.id}
                estadoAsientos={funcion.estadoAsientos}
            />
        </ScrollView>
    );
}