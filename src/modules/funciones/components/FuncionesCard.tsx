import { View, Text, TouchableOpacity, } from 'react-native';
import { Eye, SquarePen, Trash, } from 'lucide-react-native';
import type { Funcion } from '../../../types/Funcion';
import type { Pelicula } from '../../../types/Pelicula';
import type { Sala } from '../../../types/Sala';
import { commonStyles, colores } from '../../../theme';

interface FuncionCardProps {
    funcion: Funcion;
    peliculas: Pelicula[];
    salas: Sala[];
    onVer: (funcion: Funcion) => void;
    onEditar: (funcion: Funcion) => void;
    onEliminar: (funcion: Funcion) => void;
}

export default function FuncionesCard({
    funcion,
    peliculas,
    salas,
    onVer,
    onEditar,
    onEliminar,
}: FuncionCardProps) {

    const pelicula = peliculas.find(pelicula => pelicula.id === funcion.peliculaId);
    const sala = salas.find(sala => sala.id === funcion.salaId);

    return (
        <View style={commonStyles.card}>

            <Text style={commonStyles.cardTitle}>
                #{funcion.id} - {pelicula?.nombre}
            </Text>

            <Text style={commonStyles.text}>
                Duración: {pelicula?.duracion} minutos
            </Text>

            <Text style={commonStyles.text}>
                Fecha: {funcion.fecha}
            </Text>

            <Text style={commonStyles.text}>
                Hora: {funcion.horaInicio}
            </Text>

            <Text style={commonStyles.text}>
                Sala: {sala?.nombre}
            </Text>

            <View style={commonStyles.cardButtonContainter}>
                <TouchableOpacity style={commonStyles.cardButton} onPress={() => onVer(funcion)} >
                    <Eye size={22} />
                </TouchableOpacity>

                <TouchableOpacity style={commonStyles.cardButton} onPress={() => onEditar(funcion)}>
                    <SquarePen size={22} />
                </TouchableOpacity>

                <TouchableOpacity style={commonStyles.cardButton} onPress={() => onEliminar(funcion)}>
                    <Trash size={22} />
                </TouchableOpacity>
            </View>
        </View>
    );
}