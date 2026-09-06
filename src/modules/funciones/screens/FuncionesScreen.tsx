import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Plus } from 'lucide-react-native';
import type { Funcion } from '../../../types/Funcion';
import type { EstadoAsiento } from '../../../types/EstadoAsiento';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addFuncion, updateFuncion, removeFuncion, } from '../../../redux/slices/funcionSlice';
import { commonStyles, colores, } from '../../../theme';
import FuncionList from '../components/FuncionesList';
import FuncionFormModal from '../components/FuncionModal';
import FuncionDetalleModal from '../components/FuncionDetalleModal';

export default function FuncionesScreen() {

    const dispatch = useAppDispatch();
    const funciones = useAppSelector(state => state.funcion);
    const peliculas = useAppSelector(state => state.pelicula);
    const salas = useAppSelector(state => state.sala);
    const [modalVisible, setModalVisible] = useState(false);
    const [funcionSeleccionada, setFuncionSeleccionada,] = useState<Funcion | undefined>(undefined);
    const [detalleVisible, setDetalleVisible,] = useState(false);
    const [funcionDetalle, setFuncionDetalle,] = useState<Funcion | undefined>(undefined);

    const agregarFuncion = () => {
        setFuncionSeleccionada(undefined);
        setModalVisible(true);
    };

    const editarFuncion = (funcion: Funcion) => {
        setFuncionSeleccionada(funcion);
        setModalVisible(true);
    };

    const verFuncion = (funcion: Funcion) => {
        setFuncionDetalle(funcion);
        setDetalleVisible(true);
    };

    const eliminarFuncion = (funcion: Funcion) => {
        Alert.alert(
            'Eliminar función',
            `¿Seguro que deseas eliminar la función #${funcion.id}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(
                            removeFuncion(funcion.id)
                        );
                    },
                },
            ]
        );
    };

    const guardarFuncion = (datos: Omit<Funcion, 'id' | 'estadoAsientos'>) => {

        if (funcionSeleccionada) {
            dispatch(
                updateFuncion({
                    ...funcionSeleccionada,
                    ...datos,
                })
            );
        }

        else {
            const sala = salas.find(sala => sala.id === datos.salaId);

            if (!sala) {
                Alert.alert(
                    'Error',
                    'No se encontró la sala seleccionada.'
                );
                return;
            }

            const estadoAsientos:
                EstadoAsiento[] = sala.asientos.map(
                    asiento => ({
                        asientoId: asiento.id,
                        estado: 'disponible',
                    })
                );

            dispatch(
                addFuncion({
                    ...datos,
                    estadoAsientos,
                })
            );
        }

        cerrarModal();
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setFuncionSeleccionada(undefined);
    };

    const cerrarDetalle = () => {
        setDetalleVisible(false);
        setFuncionDetalle(undefined);
    };

    return (
        <View style={commonStyles.containerScreen}>
            <FuncionList
                funciones={funciones}
                peliculas={peliculas}
                salas={salas}
                onVer={verFuncion}
                onEditar={editarFuncion}
                onEliminar={eliminarFuncion}
            />

            <TouchableOpacity style={commonStyles.floatingButton} onPress={agregarFuncion}  >
                <Plus size={40} />
            </TouchableOpacity>

            <FuncionFormModal
                visible={modalVisible}
                funcion={funcionSeleccionada}
                funciones={funciones}
                peliculas={peliculas}
                salas={salas}
                onClose={cerrarModal}
                onGuardar={guardarFuncion}
            />

            <FuncionDetalleModal
                visible={detalleVisible}
                funcion={funcionDetalle}
                pelicula={peliculas.find(pelicula => pelicula.id === funcionDetalle?.peliculaId)}
                sala={salas.find(sala => sala.id === funcionDetalle?.salaId)}
                onClose={cerrarDetalle}
            />
        </View>
    );
}