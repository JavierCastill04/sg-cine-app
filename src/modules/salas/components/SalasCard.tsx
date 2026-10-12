
import { View, Text, TouchableOpacity } from 'react-native';
import type { Sala } from '../../../types/Sala';
import { commonStyles, colores } from '../../../theme';
import { SquarePen, Trash } from 'lucide-react-native';
import { useAppSelector } from '../../../redux/hooks';

interface SalaCardProps {
    sala: Sala;
    onEditar: (sala: Sala) => void;
    onEliminar: (sala: Sala) => void;
}

export default function SalaCard({
    sala,
    onEditar,
    onEliminar,
}: SalaCardProps) {
    const cines = useAppSelector(state => state.cine.lista);
    const capacidad = sala.capacidad.columnas * sala.capacidad.filas;
    const cine = cines.find(cine => cine.id === sala.cineId);

    return (
        <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>
                {sala.nombre}
            </Text>

            <Text style={commonStyles.text}>
                {cine?.nombre ?? 'Cine no encontrado'}
            </Text>

            <Text style={commonStyles.text}>
                Capacidad: {capacidad} asientos.
            </Text>

            <View style={commonStyles.cardButtonContainter}>
                <TouchableOpacity
                    style={commonStyles.cardButton}
                    onPress={() => onEditar(sala)}
                >
                    <SquarePen />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        commonStyles.cardButton,
                        { backgroundColor: colores.rojo },
                    ]}
                    onPress={() => onEliminar(sala)}
                >
                    <Trash />
                </TouchableOpacity>
            </View>
        </View>
    );
}