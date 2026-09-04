import { View, Text, TouchableOpacity, FlatList } from 'react-native';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { removePelicula } from '../../../redux/slices/peliculaSlice';

export default function PeliculasScreen() {

    const peliculas = useAppSelector(
        (state) => state.pelicula
    );

    const dispatch = useAppDispatch();

    const borrarPelicula = (id: number) => {
        dispatch(removePelicula(id));
    }

    return (
        <View>
            <Text>Películas: {peliculas.length}</Text>
            <FlatList
                data={peliculas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.nombre}</Text>
                        <TouchableOpacity onPress={() => borrarPelicula(item.id)}>
                            <Text>Borrar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}