import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../../navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { commonStyles, colores } from '../../../theme';
import { UserRound, Popcorn, Film, Sparkles } from 'lucide-react-native';
import Separador from '../../../components/separador/Separador';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <Separador />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10, opacity: 0.35 }}>
                {Array.from({ length: 12 }).map((_, index) => (
                    <Popcorn key={index} size={22} color={colores.enfasis} />
                ))}
            </View>
            <Separador />

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ alignItems: 'center', marginBottom: 40, }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Sparkles size={35} color={colores.enfasis} style={{ marginTop: -10 }} fill={colores.enfasis} />
                        <Film size={80} color={colores.enfasis} />
                        <Sparkles size={25} color={colores.enfasis} style={{ marginTop: 60 }} fill={colores.enfasis} />
                    </View>
                    <Text style={[commonStyles.title, { marginTop: 14 },]}>CINE APP </Text>
                    <Text style={[commonStyles.subtitle, { marginTop: 8, }]}>¡Bienvenido!</Text>
                    <Text style={[commonStyles.secondaryText, { marginTop: 6, }]}>Disfruta de nuestra cartelera</Text>
                </View>

                <TouchableOpacity
                    style={[
                        commonStyles.card,
                        {
                            alignItems: 'center',
                            paddingVertical: 30,
                        },
                    ]}
                    onPress={() => navigation.navigate('ClienteNavigator')
                    }
                >
                    <UserRound size={48} color={colores.enfasis} />
                    <Text style={commonStyles.cardTitle}>Clientes</Text>
                    <Text style={commonStyles.secondaryText}> Consultar cartelera y reservar </Text>
                </TouchableOpacity>

            </View>

            <Separador />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10, opacity: 0.35 }}>
                {Array.from({ length: 11 }).map((_, index) => (
                    <Popcorn key={index} size={22} color={colores.enfasis} />
                ))}

                <TouchableOpacity onPress={() => navigation.navigate('Private')}>
                    <Popcorn size={22} color={colores.enfasis} />
                </TouchableOpacity>
            </View>
            <Separador />

        </SafeAreaView >
    );
}