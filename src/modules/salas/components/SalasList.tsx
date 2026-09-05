import { FlatList, View } from 'react-native';
import type { Sala } from '../../../types/Sala';
import SalaCard from './SalasCard';

interface SalaListProps {
    salas: Sala[];
    onEditar: (sala: Sala) => void;
    onEliminar: (sala: Sala) => void;
}

export default function SalaList({ salas, onEditar, onEliminar }: SalaListProps) {
    return (
        <FlatList
            data={salas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <SalaCard
                    sala={item}
                    onEditar={onEditar}
                    onEliminar={onEliminar}
                />
            )}
        />
    );
}