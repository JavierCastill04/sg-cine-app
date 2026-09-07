import { View, Text, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import { useState } from 'react';
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

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [peliculaEditando, setPeliculaEditando] = useState<number | null>(null);
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

    const guardarPelicula = () => {
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
            const peliculaActual = peliculas.find(p => p.id === peliculaEditando);
            if (!peliculaActual) return;

            dispatch(updatePelicula({
                id: peliculaEditando,
                codigo: codigo.trim(),
                nombre: nombre.trim(),
                genero: genero.trim(),
                duracion: duracionNumerica,
                clasificacion: clasificacion.trim(),
                precio: precioNumerico,
                disponible: peliculaActual.disponible
            }));

            Alert.alert('Película actualizada', `La película "${nombre.trim()}" se actualizó correctamente.`);
        } else {
            dispatch(addPelicula({
                id: Date.now(),
                codigo: codigo.trim(),
                nombre: nombre.trim(),
                genero: genero.trim(),
                duracion: duracionNumerica,
                clasificacion: clasificacion.trim(),
                precio: precioNumerico,
                disponible: true
            }));

            Alert.alert('Película agregada', `La película "${nombre.trim()}" se agregó correctamente.`);
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
        Alert.alert('Eliminar película', `¿Estás seguro de que deseas eliminar "${nombre}"?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => {
                    dispatch(removePelicula(id));
                    Alert.alert('Película eliminada', `La película "${nombre}" se eliminó correctamente.`);
                }
            }
        ]);
    };

    const cambiarDisponibilidad = (pelicula: Pelicula) => {
        dispatch(updatePelicula({ ...pelicula, disponible: !pelicula.disponible }));
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