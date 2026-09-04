import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../../navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    return (
        <SafeAreaView>
            <View>
                <Text>Estás en Login</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PersonalNavigator')}>
                    <Text>Navegar a Personal</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    );
}