import { View, Text, TouchableOpacity } from 'react-native';
import type { Sala } from '../../../types/Sala';
import { commonStyles } from '../../../theme';
import { SquarePen, Trash } from 'lucide-react-native'

interface SalaCardProps {
    sala: Sala;
    onEditar: (sala: Sala) => void;
    onEliminar: (sala: Sala) => void;
}

export default function SalaCard({ sala, onEditar, onEliminar }: SalaCardProps) {

    const capacidad = sala.capacidad.columnas * sala.capacidad.filas;

    return (
        <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>
                {sala.nombre}
            </Text>

            <Text style={commonStyles.text}>
                Capacidad: {capacidad} asientos.
            </Text>
            <View style={commonStyles.cardButtonContainter}>
                <TouchableOpacity style={commonStyles.cardButton} onPress={() => onEditar(sala)}>
                    <SquarePen></SquarePen>
                </TouchableOpacity>
                <TouchableOpacity style={commonStyles.cardButton} onPress={() => onEliminar(sala)}>
                    <Trash></Trash>
                </TouchableOpacity>
            </View>
        </View>
    );
}