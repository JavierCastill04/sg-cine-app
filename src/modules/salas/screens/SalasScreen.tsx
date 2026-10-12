import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Plus } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import type { Sala } from '../../../types/Sala';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { commonStyles } from '../../../theme';
import { cargarCines } from '../../../redux/thunks/cineThunks';
import {
    cargarSalas,
    crearSalaThunk,
    actualizarSalaThunk,
    eliminarSalaThunk,
} from '../../../redux/thunks/salaThunks';

import SalaList from '../components/SalasList';
import SalaModal from '../components/SalaModal';

export default function SalasScreen() {
    const dispatch = useAppDispatch();

    const salas = useAppSelector(state => state.sala);
    const funciones = useAppSelector(state => state.funcion);
    const cines = useAppSelector(state => state.cine.lista);

    const [modalVisible, setModalVisible] = useState(false);
    const [salaSeleccionada, setSalaSeleccionada] = useState<Sala | undefined>(
        undefined
    );

    useEffect(() => {
        dispatch(cargarCines());
    }, [dispatch]);

    useEffect(() => {
        if (cines.length > 0) {
            dispatch(cargarSalas());
        }
    }, [dispatch, cines.length]);

    const salasOrdenadas = [...salas].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, undefined, { numeric: true })
    );

    const agregarSala = () => {
        if (cines.length === 0) {
            Toast.show({
                type: 'info',
                text1: 'Sin cines disponibles',
                text2: 'Primero debe existir un cine para registrar una sala.',
                position: 'bottom',
            });
            return;
        }

        setSalaSeleccionada(undefined);
        setModalVisible(true);
    };

    const editarSala = (sala: Sala) => {
        const estaEnFuncion = funciones.some(
            funcion => funcion.salaId === sala.id
        );

        if (estaEnFuncion) {
            Toast.show({
                type: 'error',
                text1: 'No se puede editar la sala',
                text2: 'Esta sala está asignada a una función.',
                position: 'bottom',
            });
            return;
        }

        setSalaSeleccionada(sala);
        setModalVisible(true);
    };

    const eliminarSala = (sala: Sala) => {
        const estaEnFuncion = funciones.some(
            funcion => funcion.salaId === sala.id
        );

        if (estaEnFuncion) {
            Toast.show({
                type: 'error',
                text1: 'No se puede eliminar la sala',
                text2: 'Esta sala está asignada a una función.',
                position: 'bottom',
            });
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
                    onPress: async () => {
                        try {
                            await dispatch(
                                eliminarSalaThunk(sala.id)
                            ).unwrap();

                            Toast.show({
                                type: 'success',
                                text1: 'Sala eliminada',
                                text2: `"${sala.nombre}" se eliminó correctamente.`,
                                position: 'bottom',
                            });
                        } catch (error) {
                            Toast.show({
                                type: 'error',
                                text1: 'No se pudo eliminar la sala',
                                text2: 'Verifica que no tenga funciones asociadas e inténtalo nuevamente.',
                                position: 'bottom',
                            });
                        }
                    },
                },
            ]
        );
    };

    const guardarSala = async (
        datos: Omit<Sala, 'id' | 'asientos'>
    ) => {
        const solicitud = {
            cine_id: datos.cineId,
            nombre: datos.nombre,
            filas: datos.capacidad.filas,
            columnas: datos.capacidad.columnas,
        };

        try {
            if (salaSeleccionada) {
                await dispatch(
                    actualizarSalaThunk({
                        id: salaSeleccionada.id,
                        datos: solicitud,
                    })
                ).unwrap();

                cerrarModal();

                Toast.show({
                    type: 'success',
                    text1: 'Sala actualizada',
                    text2: `"${datos.nombre}" se actualizó correctamente.`,
                    position: 'bottom',
                });
            } else {
                await dispatch(
                    crearSalaThunk(solicitud)
                ).unwrap();

                cerrarModal();

                Toast.show({
                    type: 'success',
                    text1: 'Sala registrada',
                    text2: `"${datos.nombre}" se agregó correctamente.`,
                    position: 'bottom',
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'No se pudo guardar la sala',
                text2: 'Verifica los datos e inténtalo nuevamente.',
                position: 'bottom',
            });
        }
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

            <TouchableOpacity
                style={commonStyles.floatingButton}
                onPress={agregarSala}
            >
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