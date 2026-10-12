import { useMemo, useState, useCallback } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { cargarPeliculas } from '../../../redux/thunks/peliculaThunks';
import { cargarFunciones } from '../../../redux/thunks/funcionThunks';
import type { Pelicula } from '../../../types/Pelicula';
import { useCargaPantalla } from '../../../hooks/useCargaPantalla';
import Filtros from '../../../components/filtro/Filtros';
import EstadoPantalla from '../../../components/estadoPantalla/EstadoPantalla';
import CarteleraCard from '../components/CarteleraCard';
import CarteleraSlider from '../components/CarteleraSlider';
import CarteleraModal from '../components/CarteleraModal';
import { commonStyles, colores } from '../../../theme';

export default function CarteleraScreen() {
    const dispatch = useAppDispatch();

    const [peliculaSeleccionada, setPeliculaSeleccionada] =
        useState<Pelicula | null>(null);
    const [busqueda, setBusqueda] = useState('');
    const [generoSeleccionado, setGeneroSeleccionado] = useState('');
    const [clasificacionSeleccionada, setClasificacionSeleccionada] =
        useState('');
    const [salaSeleccionada, setSalaSeleccionada] = useState<number | null>(
        null
    );
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<
        'todos' | 'disponible' | 'noDisponible'
    >('disponible');

    const peliculas = useAppSelector(state => state.pelicula.lista);
    const funciones = useAppSelector(state => state.funcion);
    const salas = useAppSelector(state => state.sala);

    const cargar = useCallback(async () => {
        await Promise.all([
            dispatch(cargarPeliculas()).unwrap(),
            dispatch(cargarFunciones()).unwrap(),
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

    const peliculasConFunciones = useMemo(
        () =>
            peliculas.filter(pelicula =>
                funciones.some(
                    funcion =>
                        funcion.peliculaId === pelicula.id &&
                        funcion.estado !== 'cancelada'
                )
            ),
        [peliculas, funciones]
    );

    const peliculasDestacadas = useMemo(
        () =>
            peliculas.filter(pelicula => {
                const numFunciones = funciones.filter(
                    funcion =>
                        funcion.peliculaId === pelicula.id &&
                        funcion.estado !== 'cancelada'
                ).length;

                return numFunciones > 3;
            }),
        [peliculas, funciones]
    );

    const generos = useMemo(
        () => [...new Set(peliculas.map(pelicula => pelicula.genero))],
        [peliculas]
    );

    const clasificaciones = useMemo(
        () => [
            ...new Set(peliculas.map(pelicula => pelicula.clasificacion)),
        ],
        [peliculas]
    );

    const obtenerSalasDePelicula = useCallback(
        (peliculaId: number) => {
            const salaIds = funciones
                .filter(
                    funcion =>
                        funcion.peliculaId === peliculaId &&
                        funcion.estado !== 'cancelada'
                )
                .map(funcion => funcion.salaId);

            return salas.filter(sala => salaIds.includes(sala.id));
        },
        [funciones, salas]
    );

    const peliculasFiltradas = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        return peliculasConFunciones.filter(pelicula => {
            const salasDePelicula = obtenerSalasDePelicula(pelicula.id);

            const nombresSalas = salasDePelicula
                .map(sala => sala.nombre.toLowerCase())
                .join(' ');

            const coincideBusqueda =
                texto === '' ||
                pelicula.nombre.toLowerCase().includes(texto) ||
                pelicula.genero.toLowerCase().includes(texto) ||
                pelicula.clasificacion.toLowerCase().includes(texto) ||
                nombresSalas.includes(texto);

            const coincideGenero =
                generoSeleccionado === '' ||
                pelicula.genero === generoSeleccionado;

            const coincideClasificacion =
                clasificacionSeleccionada === '' ||
                pelicula.clasificacion === clasificacionSeleccionada;

            const coincideSala =
                salaSeleccionada === null ||
                salasDePelicula.some(sala => sala.id === salaSeleccionada);

            const coincideEstado =
                estadoSeleccionado === 'todos' ||
                (estadoSeleccionado === 'disponible' && pelicula.disponible) ||
                (estadoSeleccionado === 'noDisponible' && !pelicula.disponible);

            return (
                coincideBusqueda &&
                coincideGenero &&
                coincideClasificacion &&
                coincideSala &&
                coincideEstado
            );
        });
    }, [
        peliculasConFunciones,
        busqueda,
        generoSeleccionado,
        clasificacionSeleccionada,
        salaSeleccionada,
        estadoSeleccionado,
        obtenerSalasDePelicula,
    ]);

    const abrirFunciones = (pelicula: Pelicula) => {
        setPeliculaSeleccionada(pelicula);
    };

    const cerrarFunciones = () => {
        setPeliculaSeleccionada(null);
    };

    return (
        <EstadoPantalla
            cargando={cargando}
            error={error}
            datosCargados={datosCargados}
            onReintentar={reintentar}
        >
            <View style={commonStyles.containerScreen}>
                <FlatList
                    data={peliculasFiltradas}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <CarteleraCard
                            pelicula={item}
                            onVerFunciones={abrirFunciones}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={actualizando}
                            onRefresh={actualizar}
                            tintColor={colores.enfasis}
                            colors={[colores.enfasis]}
                        />
                    }
                    ListHeaderComponent={
                        <>
                            <CarteleraSlider
                                peliculasDestacadas={peliculasDestacadas}
                                onVerFunciones={abrirFunciones}
                            />
                            <Filtros
                                busqueda={busqueda}
                                onBusquedaChange={setBusqueda}
                                generoSeleccionado={generoSeleccionado}
                                onGeneroChange={setGeneroSeleccionado}
                                clasificacionSeleccionada={
                                    clasificacionSeleccionada
                                }
                                onClasificacionChange={
                                    setClasificacionSeleccionada
                                }
                                salaSeleccionada={salaSeleccionada}
                                onSalaChange={setSalaSeleccionada}
                                estadoSeleccionado={estadoSeleccionado}
                                onEstadoChange={setEstadoSeleccionado}
                                generos={generos}
                                clasificaciones={clasificaciones}
                                salas={salas.map(sala => ({
                                    id: sala.id,
                                    nombre: sala.nombre,
                                }))}
                            />
                        </>
                    }
                    ListEmptyComponent={
                        <Text
                            style={[
                                commonStyles.text,
                                { textAlign: 'center', marginTop: 20 },
                            ]}
                        >
                            No se encontraron películas con los filtros
                            seleccionados.
                        </Text>
                    }
                    showsVerticalScrollIndicator={false}
                />

                <CarteleraModal
                    visible={peliculaSeleccionada !== null}
                    pelicula={peliculaSeleccionada}
                    onClose={cerrarFunciones}
                />
            </View>
        </EstadoPantalla>
    );
}