import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../../navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { commonStyles, colores } from '../../../theme';
import { ShieldCheck } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Private'>;

export default function PrivateScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <ShieldCheck size={60} color={colores.enfasis} />
                    <Text style={commonStyles.title}>CINE APP</Text>
                    <Text style={commonStyles.subtitle}>Acceso de personal</Text>
                    <Text style={commonStyles.secondaryText}>Ingresa al área de administración</Text>
                </View>

                <TouchableOpacity
                    style={[
                        commonStyles.button,
                        {
                            backgroundColor: colores.enfasis,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                    ]}
                    onPress={() => navigation.navigate('Login')}
                >
                    <ShieldCheck size={22} color={colores.negro} />
                    <Text style={[commonStyles.buttonText, { marginLeft: 10, },]}>Entrar a Personal</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}