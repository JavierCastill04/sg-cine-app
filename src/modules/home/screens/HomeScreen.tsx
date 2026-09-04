import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../../navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {

    return (
        <SafeAreaView>
            <View>
                <Text>Estás en Home</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('ClienteNavigator')}>
                <Text>Navegar a Clientes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text>Navegar a Personal</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}