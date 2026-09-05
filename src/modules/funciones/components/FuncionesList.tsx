import { FlatList } from 'react-native';

import type { Funcion } from '../../../types/Funcion';
import type { Pelicula } from '../../../types/Pelicula';
import type { Sala } from '../../../types/Sala';

import FuncionesCard from './FuncionesCard';

interface FuncionListProps {
    funciones: Funcion[];
    peliculas: Pelicula[];
    salas: Sala[];
    onVer: (funcion: Funcion) => void;
    onEditar: (funcion: Funcion) => void;
    onEliminar: (funcion: Funcion) => void;
}

export default function FuncionList({
    funciones,
    peliculas,
    salas,
    onVer,
    onEditar,
    onEliminar,
}: FuncionListProps) {
    return (
        <FlatList
            data={funciones}
            keyExtractor={funcion => String(funcion.id)}
            renderItem={({ item }) => (
                <FuncionesCard
                    funcion={item}
                    peliculas={peliculas}
                    salas={salas}
                    onVer={onVer}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                />
            )}
        />
    );
}