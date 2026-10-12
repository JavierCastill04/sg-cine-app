import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { cargarPeliculas, crearPeliculaThunk, actualizarPeliculaThunk, eliminarPeliculaThunk, cambiarDisponibilidadThunk, } from '../../../redux/thunks/peliculaThunks';
import { commonStyles, colores } from '../../../theme';
import type { Pelicula } from '../../../types/Pelicula';
import type { CrearPeliculaRequest, EstadoPelicula } from '../../../services/peliculas.service';
import PeliculaForm from '../components/PeliculaForm';
import PeliculaCard from '../components/PeliculaCard';
import type { ErroresPelicula } from '../peliculaValidaciones';
import { validarCampo } from '../peliculaValidaciones';

export default function PeliculasScreen() {
    const dispatch = useAppDispatch();
    const peliculas = useAppSelector(state => state.pelicula.lista);

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [peliculaEditando, setPeliculaEditando] = useState<number | null>(null);
    const [peliculaCambiandoEstadoId, setPeliculaCambiandoEstadoId] = useState<number | null>(null);
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [genero, setGenero] = useState('');
    const [duracion, setDuracion] = useState('');
    const [clasificacion, setClasificacion] = useState('');
    const [precio, setPrecio] = useState('');
    const [errores, setErrores] = useState<ErroresPelicula>({});

    useFocusEffect(
        useCallback(() => {
            dispatch(cargarPeliculas());
        }, [dispatch])
    );

    const limpiarFormulario = () => {
        setCodigo('');
        setNombre('');
        setGenero('');
        setDuracion('');
        setClasificacion('');
        setPrecio('');
        setErrores({});
        setPeliculaEditando(null);
    };

    const cambiarCampo = (campo: keyof ErroresPelicula, valor: string) => {
        const setters = {
            codigo: setCodigo,
            nombre: setNombre,
            genero: setGenero,
            duracion: setDuracion,
            clasificacion: setClasificacion,
            precio: setPrecio,
        };

        setters[campo](valor);

        const error = validarCampo(campo, valor, peliculas, peliculaEditando);
        setErrores(prev => {
            const nuevos = { ...prev };
            if (error) nuevos[campo] = error;
            else delete nuevos[campo];
            return nuevos;
        });
    };

    const prepararNuevaPelicula = () => {
        limpiarFormulario();
        setMostrarFormulario(true);
    };

    const editarPelicula = (pelicula: Pelicula) => {
        setPeliculaEditando(pelicula.id);
        setCodigo(pelicula.codigo);
        setNombre(pelicula.nombre);
        setGenero(pelicula.genero);
        setDuracion(pelicula.duracion.toString());
        setClasificacion(pelicula.clasificacion);
        setPrecio(pelicula.precio.toString());
        setErrores({});
        setMostrarFormulario(true);
    };

    const cancelarFormulario = () => {
        limpiarFormulario();
        setMostrarFormulario(false);
    };

    const guardarPelicula = async () => {
        if (guardando) return;

        if (!codigo.trim())
            return Alert.alert('Campo obligatorio', 'Debes ingresar el código de la película.');

        if (!/^PEL-\d{3}$/.test(codigo.trim()))
            return Alert.alert('Código inválido', 'El código debe seguir el formato PEL-001, es decir, PEL- seguido de 3 números.');

        if (peliculas.some(p => p.id !== peliculaEditando && p.codigo.toLowerCase() === codigo.trim().toLowerCase()))
            return Alert.alert('Código duplicado', `Ya existe una película con el código ${codigo.trim()}. Ingresa un código diferente.`);

        if (!nombre.trim())
            return Alert.alert('Campo obligatorio', 'Debes ingresar el nombre de la película.');

        if (!genero.trim())
            return Alert.alert('Campo obligatorio', 'Debes ingresar el género de la película.');

        const duracionNumerica = Number(duracion);
        if (!duracion.trim() || isNaN(duracionNumerica))
            return Alert.alert('Duración inválida', 'La duración debe ser un número válido.');

        if (duracionNumerica <= 0)
            return Alert.alert('Duración inválida', 'La duración debe ser mayor que 0 minutos.');

        if (!clasificacion.trim())
            return Alert.alert('Campo obligatorio', 'Debes ingresar la clasificación de la película.');

        const precioNumerico = Number(precio);
        if (!precio.trim() || isNaN(precioNumerico))
            return Alert.alert('Precio inválido', 'El precio debe ser un número válido.');

        if (precioNumerico <= 0)
            return Alert.alert('Precio inválido', 'El precio debe ser mayor que 0.');

        const datos: CrearPeliculaRequest = {
            codigo: codigo.trim(),
            nombre: nombre.trim(),
            genero: genero.trim(),
            duracion: duracionNumerica,
            clasificacion: clasificacion.trim(),
            precio: precioNumerico,
        };

        setGuardando(true);

        try {
            if (peliculaEditando !== null) {
                await dispatch(
                    actualizarPeliculaThunk({ id: peliculaEditando, datos })
                ).unwrap();

                Alert.alert('Película actualizada', `La película "${nombre.trim()}" se actualizó correctamente en Railway.`);
            } else {
                await dispatch(crearPeliculaThunk(datos)).unwrap();

                Alert.alert('Película agregada', `La película "${nombre.trim()}" se registró correctamente en Railway.`);
            }

            limpiarFormulario();
            setMostrarFormulario(false);
        } catch (error) {
            Alert.alert(
                'Error al guardar',
                typeof error === 'string'
                    ? error
                    : 'No se pudo guardar la película. Verifica tu conexión, tus permisos y que el código no exista.'
            );
        } finally {
            setGuardando(false);
        }
    };

    const eliminarPelicula = (id: number, nombrePelicula: string) => {
        Alert.alert(
            'Eliminar película',
            `¿Estás seguro de que deseas eliminar "${nombrePelicula}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await dispatch(eliminarPeliculaThunk(id)).unwrap();
                            Alert.alert('Película eliminada', `La película "${nombrePelicula}" se eliminó correctamente de Railway.`);
                        } catch (error) {
                            Alert.alert(
                                'No se pudo eliminar',
                                typeof error === 'string'
                                    ? error
                                    : 'La película puede tener funciones asociadas o existir un problema de conexión o permisos.'
                            );
                        }
                    },
                },
            ]
        );
    };

    const cambiarDisponibilidad = async (pelicula: Pelicula) => {
        if (peliculaCambiandoEstadoId !== null) return;

        const nuevoEstado: EstadoPelicula = pelicula.disponible
            ? 'No disponible'
            : 'Disponible';

        setPeliculaCambiandoEstadoId(pelicula.id);

        try {
            await dispatch(
                cambiarDisponibilidadThunk({
                    id: pelicula.id,
                    estado: nuevoEstado,
                })
            ).unwrap();

            Alert.alert(
                'Estado actualizado',
                `La película "${pelicula.nombre}" ahora está ${nuevoEstado.toLowerCase()}.`
            );
        } catch (error) {
            Alert.alert(
                'Error al cambiar disponibilidad',
                typeof error === 'string'
                    ? error
                    : 'No se pudo completar el cambio de estado en Railway.'
            );
        } finally {
            setPeliculaCambiandoEstadoId(null);
        }
    };

    return (
        <View style={commonStyles.containerScreen}>
            <FlatList
                data={peliculas}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <View>
                        <Text style={commonStyles.secondaryText}>
                            Películas registradas: {peliculas.length}
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <PeliculaCard
                        pelicula={item}
                        onEditar={() => editarPelicula(item)}
                        onEliminar={() => eliminarPelicula(item.id, item.nombre)}
                        onCambiarDisponibilidad={() => cambiarDisponibilidad(item)}
                        cambiandoDisponibilidad={peliculaCambiandoEstadoId !== null}
                    />
                )}
            />

            <TouchableOpacity
                style={commonStyles.floatingButton}
                onPress={prepararNuevaPelicula}
            >
                <Plus size={40} />
            </TouchableOpacity>

            <Modal
                visible={mostrarFormulario}
                transparent
                animationType="slide"
                onRequestClose={cancelarFormulario}
            >
                <View style={commonStyles.modalOverlay}>
                    <View style={[commonStyles.modal, { backgroundColor: colores.secundario, maxHeight: '90%' }]}>
                        <PeliculaForm
                            codigo={codigo}
                            nombre={nombre}
                            guardando={guardando}
                            genero={genero}
                            duracion={duracion}
                            clasificacion={clasificacion}
                            precio={precio}
                            setCodigo={v => cambiarCampo('codigo', v)}
                            setNombre={v => cambiarCampo('nombre', v)}
                            setGenero={v => cambiarCampo('genero', v)}
                            setDuracion={v => cambiarCampo('duracion', v)}
                            setClasificacion={v => cambiarCampo('clasificacion', v)}
                            setPrecio={v => cambiarCampo('precio', v)}
                            errores={errores}
                            editando={peliculaEditando !== null}
                            onGuardar={guardarPelicula}
                            onCancelar={cancelarFormulario}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}