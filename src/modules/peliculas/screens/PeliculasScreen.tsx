import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    Modal,
} from 'react-native';

import { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';

import {
    addPelicula,
    updatePelicula,
    removePelicula,
} from '../../../redux/slices/peliculaSlice';

import { commonStyles, colores } from '../../../theme';

import PeliculaForm from '../components/PeliculaForm';
import PeliculaCard from '../components/PeliculaCard';

import { Pelicula } from '../../../types/Pelicula';

export default function PeliculasScreen() {

    const peliculas = useAppSelector(
        (state) => state.pelicula
    );

    const dispatch = useAppDispatch();

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [peliculaEditando, setPeliculaEditando] =
        useState<number | null>(null);

    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [genero, setGenero] = useState('');
    const [duracion, setDuracion] = useState('');
    const [clasificacion, setClasificacion] = useState('');
    const [precio, setPrecio] = useState('');

    const prepararNuevaPelicula = () => {

        setPeliculaEditando(null);

        setCodigo('');
        setNombre('');
        setGenero('');
        setDuracion('');
        setClasificacion('');
        setPrecio('');

        setMostrarFormulario(true);
    };

    const editarPelicula = (
        pelicula: typeof peliculas[number]
    ) => {

        setPeliculaEditando(pelicula.id);

        setCodigo(pelicula.codigo);
        setNombre(pelicula.nombre);
        setGenero(pelicula.genero);
        setDuracion(pelicula.duracion.toString());
        setClasificacion(pelicula.clasificacion);
        setPrecio(pelicula.precio.toString());

        setMostrarFormulario(true);
    };

    const guardarPelicula = () => {

        // Código vacío
        if (codigo.trim() === '') {
            Alert.alert(
                'Campo obligatorio',
                'Debes ingresar el código de la película.'
            );
            return;
        }

        // Formato del código
        const formatoCodigo = /^PEL-\d{3}$/;

        if (!formatoCodigo.test(codigo.trim())) {
            Alert.alert(
                'Código inválido',
                'El código debe seguir el formato PEL-001, es decir, PEL- seguido de 3 números.'
            );
            return;
        }

        // Código duplicado
        const codigoExiste = peliculas.some(
            (pelicula) =>
                pelicula.id !== peliculaEditando &&
                pelicula.codigo.toLowerCase() ===
                codigo.trim().toLowerCase()
        );

        if (codigoExiste) {
            Alert.alert(
                'Código duplicado',
                `Ya existe una película con el código ${codigo.trim()}. Ingresa un código diferente.`
            );
            return;
        }

        // Nombre
        if (nombre.trim() === '') {
            Alert.alert(
                'Campo obligatorio',
                'Debes ingresar el nombre de la película.'
            );
            return;
        }

        // Género
        if (genero.trim() === '') {
            Alert.alert(
                'Campo obligatorio',
                'Debes ingresar el género de la película.'
            );
            return;
        }

        // Duración
        const duracionNumerica = Number(duracion);

        if (
            duracion.trim() === '' ||
            isNaN(duracionNumerica)
        ) {
            Alert.alert(
                'Duración inválida',
                'La duración debe ser un número válido.'
            );
            return;
        }

        if (duracionNumerica <= 0) {
            Alert.alert(
                'Duración inválida',
                'La duración debe ser mayor que 0 minutos.'
            );
            return;
        }

        // Clasificación
        if (clasificacion.trim() === '') {
            Alert.alert(
                'Campo obligatorio',
                'Debes ingresar la clasificación de la película.'
            );
            return;
        }

        // Precio
        const precioNumerico = Number(precio);

        if (
            precio.trim() === '' ||
            isNaN(precioNumerico)
        ) {
            Alert.alert(
                'Precio inválido',
                'El precio debe ser un número válido.'
            );
            return;
        }

        if (precioNumerico < 0) {
            Alert.alert(
                'Precio inválido',
                'El precio no puede ser negativo.'
            );
            return;
        }

        // Editar
        if (peliculaEditando !== null) {

            const peliculaActual = peliculas.find(
                (pelicula) =>
                    pelicula.id === peliculaEditando
            );

            if (!peliculaActual) {
                return;
            }

            dispatch(
                updatePelicula({
                    id: peliculaEditando,
                    codigo: codigo.trim(),
                    nombre: nombre.trim(),
                    genero: genero.trim(),
                    duracion: duracionNumerica,
                    clasificacion: clasificacion.trim(),
                    precio: precioNumerico,
                    disponible: peliculaActual.disponible,
                })
            );

            Alert.alert(
                'Película actualizada',
                `La película "${nombre.trim()}" se actualizó correctamente.`
            );

        } else {

            // Agregar
            const nuevaPelicula = {
                id: Date.now(),
                codigo: codigo.trim(),
                nombre: nombre.trim(),
                genero: genero.trim(),
                duracion: duracionNumerica,
                clasificacion: clasificacion.trim(),
                precio: precioNumerico,
                disponible: true,
            };

            dispatch(
                addPelicula(nuevaPelicula)
            );

            Alert.alert(
                'Película agregada',
                `La película "${nombre.trim()}" se agregó correctamente.`
            );
        }

        setCodigo('');
        setNombre('');
        setGenero('');
        setDuracion('');
        setClasificacion('');
        setPrecio('');

        setPeliculaEditando(null);
        setMostrarFormulario(false);
    };

    const cancelarFormulario = () => {

        setCodigo('');
        setNombre('');
        setGenero('');
        setDuracion('');
        setClasificacion('');
        setPrecio('');

        setPeliculaEditando(null);
        setMostrarFormulario(false);
    };

    const eliminarPelicula = (
        id: number,
        nombre: string
    ) => {

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
                    onPress: () => {

                        dispatch(
                            removePelicula(id)
                        );

                        Alert.alert(
                            'Película eliminada',
                            `La película "${nombre}" se eliminó correctamente.`
                        );
                    },
                },
            ]
        );
    };

    const cambiarDisponibilidad = (
        pelicula: Pelicula
    ) => {

        dispatch(
            updatePelicula({
                ...pelicula,
                disponible: !pelicula.disponible,
            })
        );
    };

    return (
        <View style={commonStyles.containerScreen}>

            <FlatList
                data={peliculas}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 100,
                }}

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
                        onEliminar={() =>
                            eliminarPelicula(
                                item.id,
                                item.nombre
                            )
                        }
                        onCambiarDisponibilidad={() =>
                            cambiarDisponibilidad(item)
                        }
                    />
                )}
            />

            {/* Botón flotante */}
            <TouchableOpacity
                style={commonStyles.floatingButton}
                onPress={prepararNuevaPelicula}
                activeOpacity={0.8}
            >
                <Text
                    style={{
                        color: colores.blanco,
                        fontSize: 32,
                        fontWeight: '400',
                        lineHeight: 36,
                    }}
                >
                    +
                </Text>
            </TouchableOpacity>

            {/* Modal del formulario */}
            <Modal
                visible={mostrarFormulario}
                transparent={true}
                animationType="slide"
                onRequestClose={cancelarFormulario}
            >
                <View style={commonStyles.modalOverlay}>

                    <View
                        style={[
                            commonStyles.modal,
                            {
                                backgroundColor: colores.secundario,
                                maxHeight: '90%',
                            },
                        ]}
                    >

                        <PeliculaForm
                            codigo={codigo}
                            nombre={nombre}
                            genero={genero}
                            duracion={duracion}
                            clasificacion={clasificacion}
                            precio={precio}

                            setCodigo={setCodigo}
                            setNombre={setNombre}
                            setGenero={setGenero}
                            setDuracion={setDuracion}
                            setClasificacion={setClasificacion}
                            setPrecio={setPrecio}

                            editando={
                                peliculaEditando !== null
                            }

                            onGuardar={guardarPelicula}
                            onCancelar={cancelarFormulario}
                        />

                    </View>

                </View>
            </Modal>

        </View>
    );
}