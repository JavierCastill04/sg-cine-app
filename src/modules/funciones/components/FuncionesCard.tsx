import { View, Text, TouchableOpacity } from 'react-native';
import { Eye, SquarePen, Ban } from 'lucide-react-native';
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
    const pelicula = peliculas.find(p => p.id === funcion.peliculaId);
    const sala = salas.find(s => s.id === funcion.salaId);
    const cancelada = funcion.estado === 'cancelada';

    return (
        <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>
                #{funcion.id} - {pelicula?.nombre ?? 'Película no disponible'}
            </Text>

            <Text style={commonStyles.text}>
                Duración: {pelicula?.duracion ?? '—'} minutos
            </Text>
            <Text style={commonStyles.text}>Fecha: {funcion.fecha}</Text>
            <Text style={commonStyles.text}>Hora: {funcion.horaInicio}</Text>
            <Text style={commonStyles.text}>
                Sala: {sala?.nombre ?? 'Sala no disponible'}
            </Text>
            <Text
                style={[
                    commonStyles.text,
                    { color: cancelada ? colores.rojo : colores.verde },
                ]}
            >
                Estado: {cancelada ? 'Cancelada' : 'Activa'}
            </Text>

            <View style={commonStyles.cardButtonContainter}>
                <TouchableOpacity
                    style={commonStyles.cardButton}
                    onPress={() => onVer(funcion)}
                >
                    <Eye size={22} />
                </TouchableOpacity>

                {!cancelada && (
                    <>
                        <TouchableOpacity
                            style={commonStyles.cardButton}
                            onPress={() => onEditar(funcion)}
                        >
                            <SquarePen size={22} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                commonStyles.cardButton,
                                { backgroundColor: colores.rojo },
                            ]}
                            onPress={() => onEliminar(funcion)}
                        >
                            <Ban size={22} />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}