import { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, } from 'react-native';
import { Plus } from 'lucide-react-native';
import type { Sala } from '../../../types/Sala';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addSala, updateSala, removeSala } from '../../../redux/slices/salaSlice';
import { commonStyles, colores, } from '../../../theme';
import SalaList from '../components/SalasList';
import SalaModal from '../components/SalaModal';

export default function SalasScreen() {

    const dispatch = useAppDispatch();
    const salas = useAppSelector(state => state.sala);
    const funciones = useAppSelector(state => state.funcion);
    const [modalVisible, setModalVisible] = useState(false);
    const [salaSeleccionada, setSalaSeleccionada] = useState<Sala | undefined>(undefined);

    const salasOrdenadas = [...salas].sort(
        (a, b) =>
            a.nombre.localeCompare(
                b.nombre,
                undefined,
                { numeric: true }
            )
    );

    const agregarSala = () => {
        setSalaSeleccionada(undefined);
        setModalVisible(true);
    };

    const editarSala = (sala: Sala) => {

        const estaEnFuncion = funciones.some(funcion => funcion.salaId === sala.id);

        if (estaEnFuncion) {
            Alert.alert(
                'No se puede editar',
                'Esta sala está asignada a una función.'
            );
            return;
        }

        setSalaSeleccionada(sala);
        setModalVisible(true);
    };

    const eliminarSala = (sala: Sala) => {

        const estaEnFuncion = funciones.some(funcion => funcion.salaId === sala.id);

        if (estaEnFuncion) {
            Alert.alert(
                'No se puede eliminar',
                'Esta sala está asignada a una función.'
            );
            return;
        }

        Alert.alert(
            'Eliminar sala',
            `¿Seguro que deseas eliminar ${sala.nombre}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',

                    onPress: () => {
                        dispatch(removeSala(sala.id));
                    },
                },
            ]
        );
    };

    const guardarSala = (datos: Omit<Sala, 'id' | 'asientos'>) => {
        if (salaSeleccionada) {
            dispatch(
                updateSala({
                    ...salaSeleccionada,
                    ...datos,
                })
            );
        }
        else {
            dispatch(
                addSala(datos)
            );
        }
        cerrarModal();
    };

    const cerrarModal = () => {
        setModalVisible(false);
        setSalaSeleccionada(undefined);
    };

    return (
        <View style={commonStyles.containerScreen}>
            <SalaList
                salas={salasOrdenadas}
                onEditar={editarSala}
                onEliminar={eliminarSala}
            />

            <TouchableOpacity style={commonStyles.floatingButton} onPress={agregarSala}  >
                <Plus size={40} />
            </TouchableOpacity>

            <SalaModal
                visible={modalVisible}
                sala={salaSeleccionada}
                salas={salas}
                onClose={cerrarModal}
                onGuardar={guardarSala}
            />
        </View>
    );
}