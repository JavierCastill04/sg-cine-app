import { Text, View } from "react-native";
import type { Funcion } from "../../../types/Funcion";
import type { Sala } from "../../../types/Sala";
import AsientosGrid from "../../../components/asientos/AsientosGrid";
import { commonStyles, colores } from "../../../theme";

interface Props {
    sala: Sala;
    funcion: Funcion;
    seleccionados: string[];
    total: number;
    onSeleccionar: (id: string) => void;
}

export default function PasoAsientos({
    sala,
    funcion,
    seleccionados,
    total,
    onSeleccionar
}: Props) {
    return (
        <>
            <Text style={commonStyles.subtitle}>
                Selecciona tus asientos
            </Text>

            <AsientosGrid
                filas={sala.capacidad.filas}
                columnas={sala.capacidad.columnas}
                salaId={sala.id}
                estadoAsientos={funcion.estadoAsientos}
                seleccionados={seleccionados}
                onSeleccionar={onSeleccionar}
            />

            <View style={[commonStyles.card, {marginTop:20}]}>
                <Text style={commonStyles.cardTitle}>Resumen</Text>
                <Text style={commonStyles.secondaryText}>
                    Boletos: {seleccionados.length}
                </Text>
                <Text style={{ color: colores.enfasis, fontSize: 18, fontWeight: "700" }}>
                    Total: ${total.toFixed(2)}
                </Text>
            </View>
        </>
    );
}