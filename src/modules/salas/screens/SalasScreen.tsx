import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Plus } from 'lucide-react-native';
import type { Sala } from '../../../types/Sala';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { commonStyles } from '../../../theme';
import { cargarCines } from '../../../redux/thunks/cineThunks';
import { cargarSalas, crearSalaThunk, actualizarSalaThunk, eliminarSalaThunk, } from '../../../redux/thunks/salaThunks';
import SalaList from '../components/SalasList';
import SalaModal from '../components/SalaModal';

export default function SalasScreen() {
    const dispatch = useAppDispatch();

    const salas = useAppSelector(state => state.sala);
    const funciones = useAppSelector(state => state.funcion);
    const cines = useAppSelector(state => state.cine.lista);
    const [modalVisible, setModalVisible] = useState(false);
    const [salaSeleccionada, setSalaSeleccionada] = useState<Sala | undefined>(undefined);

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
            Alert.alert(
                'Sin cines disponibles',
                'No hay cines cargados. Verifica que existan cines antes de crear una sala.'
            );
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
        const estaEnFuncion = funciones.some(
            funcion => funcion.salaId === sala.id
        );

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
                    onPress: async () => {
                        try {
                            await dispatch(eliminarSalaThunk(sala.id)).unwrap();
                        } catch (error) {
                            Alert.alert(
                                'Error',
                                typeof error === 'string'
                                    ? error
                                    : 'No se pudo eliminar la sala.'
                            );
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
            } else {
                await dispatch(crearSalaThunk(solicitud)).unwrap();
            }

            cerrarModal();
        } catch (error) {
            Alert.alert(
                'Error',
                typeof error === 'string'
                    ? error
                    : 'No se pudo guardar la sala.'
            );
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