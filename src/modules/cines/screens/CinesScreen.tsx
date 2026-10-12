import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, } from 'react-native';
import * as Location from 'expo-location';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { cargarCines } from '../../../redux/thunks/cineThunks';
import { commonStyles } from '../../../theme';
import CinesMapa from '../components/CinesMapa';
import { ordenarCinesPorDistancia, type Ubicacion, type CineConDistancia, } from '../utils/distancia';

export default function CinesScreen() {
    const dispatch = useAppDispatch();

    const cines = useAppSelector(state => state.cine.lista);
    const cargando = useAppSelector(state => state.cine.cargando);
    const error = useAppSelector(state => state.cine.error);

    const [ubicacionUsuario, setUbicacionUsuario] =
        useState<Ubicacion | null>(null);

    const [mensajeUbicacion, setMensajeUbicacion] =
        useState<string | null>(null);

    useEffect(() => {
        dispatch(cargarCines());
    }, [dispatch]);

    useEffect(() => {
        let activo = true;

        const obtenerUbicacion = async () => {
            try {
                const permiso =
                    await Location.requestForegroundPermissionsAsync();

                if (permiso.status !== 'granted') {
                    if (activo) {
                        setMensajeUbicacion(
                            'Permiso de ubicación denegado. Puedes consultar los cines sin distancias.'
                        );
                    }
                    return;
                }

                const posicion = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });

                if (activo) {
                    setUbicacionUsuario({
                        latitud: posicion.coords.latitude,
                        longitud: posicion.coords.longitude,
                    });
                    setMensajeUbicacion(null);
                }
            } catch (err) {
                console.error('Error al obtener ubicación:', err);

                if (activo) {
                    setMensajeUbicacion(
                        'No se pudo obtener tu ubicación. Verifica que el GPS esté activado.'
                    );
                }
            }
        };

        obtenerUbicacion();

        return () => {
            activo = false;
        };
    }, []);

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
        <View style={commonStyles.cinesContainer}>
            {cargando ? (
                <View style={commonStyles.cinesEstadoContainer}>
                    <ActivityIndicator size="large" />
                    <Text style={commonStyles.cinesDescription}>
                        Cargando cines...
                    </Text>
                </View>
            ) : error ? (
                <View style={commonStyles.cinesEstadoContainer}>
                    <Text style={commonStyles.cinesDescription}>
                        {error}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={cinesOrdenados}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderCine}
                    contentContainerStyle={commonStyles.cinesLista}
                    ListHeaderComponent={
                        <View>
                            <Text style={commonStyles.title}>
                                Cines cercanos
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
            )}
        </View>
    );
}