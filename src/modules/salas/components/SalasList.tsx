import { FlatList, View } from 'react-native';
import type { Sala } from '../../../types/Sala';
import SalaCard from './SalasCard';

interface SalaListProps {
    salas: Sala[];
}

export default function SalaList({ salas }: SalaListProps) {
    return (
        <FlatList
            data={salas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <SalaCard sala={item} />
            )}
        />
    );
}