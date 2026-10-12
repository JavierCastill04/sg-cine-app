import { View, Text, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    peliculasService,
    convertirPelicula,
    type CrearPeliculaRequest,
} from '../../../services/peliculas.service';import { setPeliculas } from '../../../redux/slices/peliculaSlice';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { addPelicula, updatePelicula, removePelicula } from '../../../redux/slices/peliculaSlice';
import { commonStyles, colores } from '../../../theme';
import PeliculaForm from '../components/PeliculaForm';
import PeliculaCard from '../components/PeliculaCard';
import { Pelicula } from '../../../types/Pelicula';
import { Plus } from 'lucide-react-native';
import type { ErroresPelicula } from '../peliculaValidaciones';
import { validarCampo } from '../peliculaValidaciones';

export default function PeliculasScreen() {
    const peliculas = useAppSelector(state => state.pelicula);
    const dispatch = useAppDispatch();
    useFocusEffect(
    useCallback(() => {
        let activo = true;

        const cargarPeliculas = async () => {
            try {
                const respuesta = await peliculasService.listar();

                if (activo) {
                    dispatch(
                        setPeliculas(respuesta.map(convertirPelicula))
                    );
                }
            } catch (error) {
                if (activo) {
                    console.error('Error al cargar películas:', error);
                    Alert.alert(
                        'Error de conexión',
                        'No se pudieron cargar las películas desde Railway.'
                    );
                }
            }
        };

        cargarPeliculas();

        return () => {
            activo = false;
        };
    }, [dispatch])
);
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

    const cambiarCampo = (campo: keyof ErroresPelicula, valor: string) => {
        const setters = { codigo: setCodigo, nombre: setNombre, genero: setGenero, duracion: setDuracion, clasificacion: setClasificacion, precio: setPrecio };
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
        setPeliculaEditando(null);
        setCodigo(''); setNombre(''); setGenero(''); setDuracion(''); setClasificacion(''); setPrecio('');
        setErrores({});
        setMostrarFormulario(true);
    };

    const editarPelicula = (pelicula: typeof peliculas[number]) => {
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

    const guardarPelicula = async () => {
        if (codigo.trim() === '') return Alert.alert('Campo obligatorio', 'Debes ingresar el código de la película.');

        if (!/^PEL-\d{3}$/.test(codigo.trim()))
            return Alert.alert('Código inválido', 'El código debe seguir el formato PEL-001, es decir, PEL- seguido de 3 números.');

        if (peliculas.some(p => p.id !== peliculaEditando && p.codigo.toLowerCase() === codigo.trim().toLowerCase()))
            return Alert.alert('Código duplicado', `Ya existe una película con el código ${codigo.trim()}. Ingresa un código diferente.`);

        if (nombre.trim() === '') return Alert.alert('Campo obligatorio', 'Debes ingresar el nombre de la película.');
        if (genero.trim() === '') return Alert.alert('Campo obligatorio', 'Debes ingresar el género de la película.');

        const duracionNumerica = Number(duracion);
        if (duracion.trim() === '' || isNaN(duracionNumerica))
            return Alert.alert('Duración inválida', 'La duración debe ser un número válido.');
        if (duracionNumerica <= 0)
            return Alert.alert('Duración inválida', 'La duración debe ser mayor que 0 minutos.');

        if (clasificacion.trim() === '') return Alert.alert('Campo obligatorio', 'Debes ingresar la clasificación de la película.');

        const precioNumerico = Number(precio);
        if (precio.trim() === '' || isNaN(precioNumerico))
            return Alert.alert('Precio inválido', 'El precio debe ser un número válido.');
        if (precioNumerico <= 0)
            return Alert.alert('Precio inválido', 'El precio no puede ser negativo.');

        
if (peliculaEditando !== null) {
    if (guardando) return;

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

await peliculasService.actualizar(
    peliculaEditando,
    datos
);

const peliculasActualizadas = await peliculasService.listar();

dispatch(
    setPeliculas(peliculasActualizadas.map(convertirPelicula))
);


        Alert.alert(
            'Película actualizada',
            `La película "${nombre.trim()}" se actualizó correctamente en Railway.`
        );
    } catch (error) {
        console.error('Error al actualizar película:', error);

        Alert.alert(
            'Error al actualizar',
            'No se pudo actualizar la película en Railway. Verifica tu conexión, tus permisos y que el código no exista.'
        );

        return;
    } finally {
        setGuardando(false);
    
}

        
} else {
    if (guardando) return;

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
        const respuesta = await peliculasService.crear(datos);

        dispatch(
            addPelicula(convertirPelicula(respuesta.pelicula))
        );

        Alert.alert(
            'Película agregada',
            `La película "${nombre.trim()}" se registró correctamente en Railway.`
        );
    } catch (error) {
        console.error('Error al registrar película:', error);

        Alert.alert(
            'Error al registrar',
            'No se pudo registrar la película en Railway. Verifica tu conexión, tus permisos y que el código no exista.'
        );

        return;
    } finally {
        setGuardando(false);
    }
}


        setCodigo(''); setNombre(''); setGenero(''); setDuracion(''); setClasificacion(''); setPrecio('');
        setErrores({});
        setPeliculaEditando(null);
        setMostrarFormulario(false);
    };

    const cancelarFormulario = () => {
        setCodigo(''); setNombre(''); setGenero(''); setDuracion(''); setClasificacion(''); setPrecio('');
        setErrores({});
        setPeliculaEditando(null);
        setMostrarFormulario(false);
    };


const eliminarPelicula = (id: number, nombre: string) => {
    Alert.alert(
        'Eliminar película',
        `¿Estás seguro de que deseas eliminar "${nombre}"?`,
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
                        await peliculasService.eliminar(id);

                        dispatch(removePelicula(id));

                        Alert.alert(
                            'Película eliminada',
                            `La película "${nombre}" se eliminó correctamente de Railway.`
                        );
                    } catch (error) {
                        console.error(
                            'Error al eliminar película:',
                            error
                        );

                        Alert.alert(
                            'No se pudo eliminar',
                            'La película puede tener funciones asociadas o puede existir un problema de conexión o permisos.'
                        );
                    }
                },
            },
        ]
    );
};




const cambiarDisponibilidad = async (pelicula: Pelicula) => {
    if (peliculaCambiandoEstadoId !== null) return;

    const nuevoEstado = pelicula.disponible
        ? 'No disponible'
        : 'Disponible';

    setPeliculaCambiandoEstadoId(pelicula.id);

    try {
        await peliculasService.cambiarEstado(
            pelicula.id,
            nuevoEstado
        );

        const peliculasActualizadas = await peliculasService.listar();

        dispatch(
            setPeliculas(peliculasActualizadas.map(convertirPelicula))
        );

        Alert.alert(
            'Estado actualizado',
            `La película "${pelicula.nombre}" ahora está ${nuevoEstado.toLowerCase()}.`
        );
    } catch (error) {
        console.error('Error al cambiar disponibilidad:', error);

        Alert.alert(
            'Error al cambiar disponibilidad',
            'No se pudo completar o verificar el cambio de estado en Railway. Vuelve a consultar las películas antes de intentarlo nuevamente.'
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
                        <Text style={commonStyles.secondaryText}>Películas registradas: {peliculas.length}</Text>
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
            <TouchableOpacity style={commonStyles.floatingButton} onPress={prepararNuevaPelicula}><Plus size={40} /></TouchableOpacity>
            <Modal visible={mostrarFormulario} transparent animationType="slide" onRequestClose={cancelarFormulario}>
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