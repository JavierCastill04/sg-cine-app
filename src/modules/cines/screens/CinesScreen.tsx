import { useCallback, useEffect, useMemo, useState, } from 'react';
import { FlatList, RefreshControl, Text, View, } from 'react-native';
import * as Location from 'expo-location';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { cargarCines } from '../../../redux/thunks/cineThunks';
import { commonStyles, colores } from '../../../theme';
import { useCargaPantalla } from '../../../hooks/useCargaPantalla';
import EstadoPantalla from '../../../components/estadoPantalla/EstadoPantalla';

import CinesMapa from '../components/CinesMapa';
import { ordenarCinesPorDistancia, type Ubicacion, type CineConDistancia, } from '../utils/distancia';

export default function CinesScreen() {
    const dispatch = useAppDispatch();

    const cines = useAppSelector(state => state.cine.lista);

    const [ubicacionUsuario, setUbicacionUsuario] =
        useState<Ubicacion | null>(null);

    const [mensajeUbicacion, setMensajeUbicacion] =
        useState<string | null>(null);

    const [restablecerEncuadre, setRestablecerEncuadre] =
        useState(0);

    const cargar = useCallback(async () => {
        await dispatch(cargarCines()).unwrap();
    }, [dispatch]);

    const {
        cargando,
        actualizando,
        error,
        datosCargados,
        actualizar,
        reintentar,
    } = useCargaPantalla({ cargar });

    useEffect(() => {
        void reintentar();
    }, [reintentar]);

    const obtenerUbicacion = useCallback(async () => {
        try {
            const permiso =
                await Location.requestForegroundPermissionsAsync();

            if (permiso.status !== 'granted') {
                setMensajeUbicacion(
                    'Permiso de ubicación denegado. Puedes consultar los cines sin distancias.'
                );
                return;
            }

            const posicion = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setUbicacionUsuario({
                latitud: posicion.coords.latitude,
                longitud: posicion.coords.longitude,
            });

            setMensajeUbicacion(null);
        } catch (err) {
            console.error('Error al obtener ubicación:', err);

            setMensajeUbicacion(
                'No se pudo obtener tu ubicación. Verifica que el GPS esté activado.'
            );
        }
    }, []);

    useEffect(() => {
        let activo = true;

        const obtenerUbicacionInicial = async () => {
            try {
                const permiso =
                    await Location.requestForegroundPermissionsAsync();

                if (!activo) return;

                if (permiso.status !== 'granted') {
                    setMensajeUbicacion(
                        'Permiso de ubicación denegado. Puedes consultar los cines sin distancias.'
                    );
                    return;
                }

                const posicion = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                if (!activo) return;

                setUbicacionUsuario({
                    latitud: posicion.coords.latitude,
                    longitud: posicion.coords.longitude,
                });

                setMensajeUbicacion(null);
            } catch (err) {
                console.error('Error al obtener ubicación:', err);

                if (activo) {
                    setMensajeUbicacion(
                        'No se pudo obtener tu ubicación. Verifica que el GPS esté activado.'
                    );
                }
            }
        };

        void obtenerUbicacionInicial();

        return () => {
            activo = false;
        };
    }, []);

    const actualizarYRestablecer = useCallback(async () => {
        await actualizar();
        await obtenerUbicacion();

        setRestablecerEncuadre(valor => valor + 1);
    }, [actualizar, obtenerUbicacion]);

    const cinesOrdenados = useMemo<CineConDistancia[]>(() => {
        if (!ubicacionUsuario) {
            return cines.map(cine => ({
                ...cine,
                distanciaKm: null,
            }));
        }

        return ordenarCinesPorDistancia(cines, ubicacionUsuario);
    }, [cines, ubicacionUsuario]);

    const renderCine = ({ item }: { item: CineConDistancia }) => (
        <View style={commonStyles.cinesCard}>
            <Text style={commonStyles.cinesNombre}>
                {item.nombre}
            </Text>

            <Text style={commonStyles.cinesDireccion}>
                {item.direccion}
            </Text>

            {item.distanciaKm !== null && (
                <Text style={commonStyles.cinesDistancia}>
                    A {item.distanciaKm.toFixed(2)} km de ti
                </Text>
            )}
        </View>
    );

    return (
        <EstadoPantalla
            cargando={cargando}
            error={error}
            datosCargados={datosCargados}
            onReintentar={reintentar}
        >
            <View style={commonStyles.cinesContainer}>
                <FlatList
                    data={cinesOrdenados}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderCine}
                    contentContainerStyle={commonStyles.cinesLista}
                    refreshControl={
                        <RefreshControl
                            refreshing={actualizando}
                            onRefresh={actualizarYRestablecer}
                            tintColor={colores.enfasis}
                            colors={[colores.enfasis]}
                        />
                    }
                    ListHeaderComponent={
                        <View>
                            <Text style={commonStyles.title}>
                            </Text>

                            {mensajeUbicacion && (
                                <Text style={commonStyles.cinesDescription}>
                                    {mensajeUbicacion}
                                </Text>
                            )}

                            <View style={commonStyles.cinesMapaContenedor}>
                                <CinesMapa
                                    cines={cines}
                                    ubicacionUsuario={ubicacionUsuario}
                                    restablecerEncuadre={restablecerEncuadre}
                                />
                            </View>
                        </View>
                    }
                    ListEmptyComponent={
                        <Text style={commonStyles.cinesDescription}>
                            No hay cines disponibles.
                        </Text>
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </EstadoPantalla>
    );
}