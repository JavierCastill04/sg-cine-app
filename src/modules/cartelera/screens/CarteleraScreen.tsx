import { useState } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { View, Text } from 'react-native';
import { Pelicula } from '../../../types/Pelicula';
import CarteleraList from '../components/CarteleraList';
import CarteleraSlider from '../components/CarteleraSlider';
import { commonStyles } from '../../../theme';

export default function CarteleraScreen() {
    const [peliculaSeleccionada, setPeliculaSeleccionada] = useState<Pelicula | null>(null);
    const peliculas = useAppSelector(state => state.pelicula);
    const funciones = useAppSelector(state => state.funcion);
    const peliculasDisponibles = peliculas.filter(
        (pelicula) => pelicula.disponible === true && funciones.some((funcion) => funcion.peliculaId === pelicula.id)
    );
    const peliculasDestacadas = peliculas.filter((pelicula) => {
        const numFunciones = funciones.filter
            ((funcion) => funcion.peliculaId === pelicula.id).length;
        return numFunciones > 3;
    });

    const abrirFunciones = (pelicula: Pelicula) => {
        setPeliculaSeleccionada(pelicula);
    };

    return (
        <View style={commonStyles.containerScreen}>

            <CarteleraSlider
                peliculasDestacadas={peliculasDestacadas}
                onVerFunciones={abrirFunciones}
            />
            <Text style={[commonStyles.subtitle, { marginBottom: 20 }]}>
                Cartelera semanal
            </Text>
            <CarteleraList
                peliculas={peliculasDisponibles}
            />
            { /*
            <SalaModal
                visible={modalVisible}
                sala={salaSeleccionada}
                salas={salas}
                onClose={cerrarModal}
                onGuardar={guardarSala}
            />
            */}
        </View>
    );
}