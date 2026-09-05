import { View, Text, TouchableOpacity } from 'react-native';
import type { Sala } from '../../../types/Sala';
import { commonStyles } from '../../../theme';
import { SquarePen, Trash } from 'lucide-react-native'
import { updateSala, removeSala } from '../../../redux/slices/salaSlice';
import { useAppDispatch } from '../../../redux/hooks';

interface SalaCardProps { sala: Sala; }

export default function SalaCard({ sala }: SalaCardProps) {

    const capacidad = sala.capacidad.columnas * sala.capacidad.filas;
    const dispatch = useAppDispatch();

    return (
        <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>
                {sala.nombre}
            </Text>

            <Text style={commonStyles.text}>
                Capacidad: {capacidad} asientos.
            </Text>
            <View style={commonStyles.cardButtonContainter}>
                <TouchableOpacity style={commonStyles.cardButton} onPress={() => {dispatch(updateSala(sala))}}>
                    <SquarePen></SquarePen>
                </TouchableOpacity>
                <TouchableOpacity style={commonStyles.cardButton}  onPress={() => {dispatch(removeSala(sala.id))}}>
                    <Trash></Trash>
                </TouchableOpacity>
            </View>
        </View>
    );
}