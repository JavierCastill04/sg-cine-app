import { View, Text } from 'react-native';

import { useAppSelector } from '../../../redux/hooks';
import { commonStyles } from '../../../theme';
import SalaList from '../components/SalasList';

export default function SalasScreen() {

    const salas = useAppSelector(state => state.sala);

    return (
        <View style={commonStyles.containerScreen}>
            <SalaList salas={salas} />
        </View>
    );
}