import { useCallback, useState } from 'react';
import { View, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { Plus } from 'lucide-react-native';
import type { Funcion } from '../../../types/Funcion';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { cargarFunciones, crearFuncionThunk, reprogramarFuncionThunk, cancelarFuncionThunk } from '../../../redux/thunks/funcionThunks';
import { cargarPeliculas } from '../../../redux/thunks/peliculaThunks';
import { cargarSalas } from '../../../redux/thunks/salaThunks';
import { commonStyles, colores } from '../../../theme';
import { useCargaPantalla } from '../../../hooks/useCargaPantalla';
import EstadoPantalla from '../../../components/estadoPantalla/EstadoPantalla';
import FuncionList from '../components/FuncionesList';
import FuncionFormModal from '../components/FuncionModal';
import FuncionDetalleModal from '../components/FuncionDetalleModal';

export default function FuncionesScreen() {
    const dispatch = useAppDispatch();

    const funciones = useAppSelector(state => state.funcion);
    const peliculas = useAppSelector(state => state.pelicula.lista);
    const salas = useAppSelector(state => state.sala);

    const [modalVisible, setModalVisible] = useState(false);
    const [funcionSeleccionada, setFuncionSeleccionada] =
        useState<Funcion | undefined>();
    const [detalleVisible, setDetalleVisible] = useState(false);
    const [funcionDetalle, setFuncionDetalle] =
        useState<Funcion | undefined>();

    const cargar = useCallback(async () => {
        await Promise.all([
            dispatch(cargarPeliculas()).unwrap(),
            dispatch(cargarFunciones()).unwrap(),
            dispatch(cargarSalas()).unwrap(),
        ]);
    }, [dispatch]);

    const {
        cargando,
        actualizando,
        error,
        datosCargados,
        actualizar,
        reintentar,
    } = useCargaPantalla({ cargar });

    const agregarFuncion = () => {
        setFuncionSeleccionada(undefined);
        setModalVisible(true);
    };

    const editarFuncion = (funcion: Funcion) => {
        if (funcion.estado === 'cancelada') {
            Alert.alert(
                'Función cancelada',
                'No se puede reprogramar una función cancelada.'
            );
            return;
        }

        setFuncionSeleccionada(funcion);
        setModalVisible(true);
    };

    const verFuncion = (funcion: Funcion) => {
        setFuncionDetalle(funcion);
        setDetalleVisible(true);
    };

    const cancelarFuncion = (funcion: Funcion) => {
        if (funcion.estado === 'cancelada') {
            Alert.alert('Función cancelada', 'Esta función ya está cancelada.');
            return;
        }

        Alert.alert(
            'Cancelar función',
            `¿Seguro que deseas cancelar la función #${funcion.id}?`,
            [
                { text: 'Volver', style: 'cancel' },
                {
                    text: 'Cancelar función',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const respuesta = await dispatch(
                                cancelarFuncionThunk(funcion.id)
                            ).unwrap();

                            Alert.alert('Función cancelada', respuesta.message);
                        } catch (error) {
                            Alert.alert(
                                'Error',
                                typeof error === 'string'
                                    ? error
                                    : 'No se pudo cancelar la función.'
                            );
                        }
                    },
                },
            ]
        );
    };

    const guardarFuncion = async (
        datos: Omit<Funcion, 'id' | 'estadoAsientos'>
    ) => {
        const horaInicio =
            datos.horaInicio.length === 5
                ? `${datos.horaInicio}:00`
                : datos.horaInicio;

        const datosApi = {
            peliculaId: datos.peliculaId,
            salaId: datos.salaId,
            fechaHora: `${datos.fecha} ${horaInicio}`,
        };

        try {
            if (funcionSeleccionada) {
                await dispatch(
                    reprogramarFuncionThunk({
                        id: funcionSeleccionada.id,
                        datos: datosApi,
                    })
                ).unwrap();

                Alert.alert('Éxito', 'La función se reprogramó correctamente.');
            } else {
                await dispatch(crearFuncionThunk(datosApi)).unwrap();

                Alert.alert('Éxito', 'La función se creó correctamente.');
            }

            cerrarModal();
        } catch (error) {
            Alert.alert(
                'Error',
                typeof error === 'string'
                    ? error
                    : 'No se pudo guardar la función.'
            );
        }
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
        <EstadoPantalla
            cargando={cargando}
            error={error}
            datosCargados={datosCargados}
            onReintentar={reintentar}
        >
            <View style={commonStyles.containerScreen}>
                <FuncionList
                    funciones={funciones}
                    peliculas={peliculas}
                    salas={salas}
                    onVer={verFuncion}
                    onEditar={editarFuncion}
                    onEliminar={cancelarFuncion}
                    refreshControl={
                        <RefreshControl
                            refreshing={actualizando}
                            onRefresh={actualizar}
                            tintColor={colores.enfasis}
                            colors={[colores.enfasis]}
                        />
                    }
                />

                <TouchableOpacity
                    style={commonStyles.floatingButton}
                    onPress={agregarFuncion}
                >
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
                    pelicula={peliculas.find(
                        pelicula => pelicula.id === funcionDetalle?.peliculaId
                    )}
                    sala={salas.find(
                        sala => sala.id === funcionDetalle?.salaId
                    )}
                    onClose={cerrarDetalle}
                />
            </View>
        </EstadoPantalla>
    );
}