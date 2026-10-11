
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { X, CalendarDays, Clock } from 'lucide-react-native';

import type { RootStackParamList } from '../../../navigation/types';
import type { Pelicula } from '../../../types/Pelicula';
import { colores, commonStyles } from '../../../theme';
import { useAppSelector } from '../../../redux/hooks';

interface FuncionesModalProps {
    visible: boolean;
    pelicula: Pelicula | null;
    onClose: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CarteleraModal({
    visible,
    pelicula,
    onClose,
}: FuncionesModalProps) {
    const navigation = useNavigation<NavigationProp>();

    const funciones = useAppSelector(state => state.funcion);
    const autenticado = useAppSelector(
        state => state.auth.autenticado
    );

    if (!pelicula) {
        return null;
    }

    const funcionesPelicula = funciones.filter(
        funcion => funcion.peliculaId === pelicula.id
    );

    const seleccionarFuncion = (funcionId: number) => {
        onClose();

        if (!autenticado) {
            navigation.navigate('Login', { funcionId });
            return;
        }

        navigation.navigate('Reserva', { funcionId });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={commonStyles.modalOverlay}>
                <View style={commonStyles.modal}>
                    <View style={commonStyles.carteleraModalHeader}>
                        <Text
                            style={commonStyles.carteleraModalTitulo}
                            numberOfLines={1}
                        >
                            {pelicula.nombre}
                        </Text>

                        <TouchableOpacity onPress={onClose}>
                            <X
                                size={30}
                                color={colores.enfasis}
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={commonStyles.carteleraModalEtiquetas}>
                            <Text style={commonStyles.carteleraModalEtiqueta}>
                                {pelicula.clasificacion}
                            </Text>

                            <Text style={commonStyles.carteleraModalEtiqueta}>
                                {pelicula.genero}
                            </Text>

                            <Text style={commonStyles.carteleraModalEtiqueta}>
                                {pelicula.duracion} min
                            </Text>
                        </View>

                        <Text style={commonStyles.carteleraModalSubtitulo}>
                            Funciones disponibles
                        </Text>

                        {funcionesPelicula.map(funcion => (
                            <TouchableOpacity
                                key={funcion.id}
                                style={commonStyles.carteleraModalFuncion}
                                onPress={() =>
                                    seleccionarFuncion(funcion.id)
                                }
                            >
                                <View style={commonStyles.carteleraModalDato}>
                                    <CalendarDays
                                        size={18}
                                        color={colores.enfasis}
                                    />

                                    <Text style={commonStyles.carteleraModalTexto}>
                                        {funcion.fecha}
                                    </Text>
                                </View>

                                <View style={commonStyles.carteleraModalDato}>
                                    <Clock
                                        size={18}
                                        color={colores.enfasis}
                                    />

                                    <Text style={commonStyles.carteleraModalTexto}>
                                        {funcion.horaInicio}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
