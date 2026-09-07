import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity } from 'react-native';

import { RootStackParamList } from '../../../navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { commonStyles, colores } from '../../../theme';
import { UserRound, Popcorn, Film } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <View style={{ flex: 1, justifyContent: 'center' }}>

                {/* Encabezado */}
                <View
                    style={{
                        alignItems: 'center',
                        marginBottom: 40,
                    }}
                >
                    <Film
                        size={60}
                        color={colores.enfasis}
                    />

                    <Text
                        style={[
                            commonStyles.title,
                            {
                                color: colores.enfasis,
                                textAlign: 'center',
                                marginTop: 12,
                            },
                        ]}
                    >
                        CINE APP
                    </Text>

                    <Text
                        style={[
                            commonStyles.subtitle,
                            {
                                color: colores.blanco,
                                textAlign: 'center',
                                marginTop: 8,
                            },
                        ]}
                    >
                        ¡Bienvenido!
                    </Text>

                    <Text
                        style={[
                            commonStyles.secondaryText,
                            {
                                textAlign: 'center',
                                marginTop: 6,
                            },
                        ]}
                    >
                        Disfruta de nuestra cartelera
                    </Text>
                </View>

                {/* Acceso para clientes */}
                <TouchableOpacity
                    style={[
                        commonStyles.card,
                        {
                            backgroundColor: colores.secundario,
                            alignItems: 'center',
                            paddingVertical: 30,
                        },
                    ]}
                    onPress={() =>
                        navigation.navigate('ClienteNavigator')
                    }
                >
                    <UserRound
                        size={48}
                        color={colores.enfasis}
                    />

                    <Text
                        style={[
                            commonStyles.cardTitle,
                            {
                                color: colores.blanco,
                                marginTop: 12,
                            },
                        ]}
                    >
                        Clientes
                    </Text>

                    <Text
                        style={[
                            commonStyles.secondaryText,
                            {
                                textAlign: 'center',
                                marginTop: 5,
                            },
                        ]}
                    >
                        Consultar cartelera y reservar
                    </Text>
                </TouchableOpacity>

            </View>

            {/* Acceso oculto para personal */}
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={{
                    position: 'absolute',
                    bottom: 15,
                    right: 10,
                    padding: 10,
                    opacity: 0.35,
                }}
            >
                <Popcorn
                    size={22}
                    color={colores.blanco}
                />
            </TouchableOpacity>

        </SafeAreaView>
    );
}