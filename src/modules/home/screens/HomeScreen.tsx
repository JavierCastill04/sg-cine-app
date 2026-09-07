import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity } from 'react-native';

import { RootStackParamList } from '../../../navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { commonStyles, colores } from '../../../theme';
import { UserRound, ShieldCheck } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <View style={{ flex: 1, justifyContent: 'center' }}>

                {/* Encabezado */}
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <Text
                        style={[
                            commonStyles.title,
                            {
                                color: colores.enfasis,
                                textAlign: 'center',
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
                        Bienvenido
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
                        Selecciona una opción para continuar
                    </Text>
                </View>

                {/* Acceso a Clientes */}
                <TouchableOpacity
                    style={[
                        commonStyles.card,
                        {
                            backgroundColor: colores.secundario,
                            alignItems: 'center',
                            paddingVertical: 25,
                        },
                    ]}
                    onPress={() => navigation.navigate('ClienteNavigator')}
                >
                    <UserRound
                        size={42}
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

                {/* Acceso a Personal */}
                <TouchableOpacity
                    style={[
                        commonStyles.card,
                        {
                            backgroundColor: colores.secundario,
                            alignItems: 'center',
                            paddingVertical: 25,
                        },
                    ]}
                    onPress={() => navigation.navigate('Login')}
                >
                    <ShieldCheck
                        size={42}
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
                        Personal
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
                        Acceder a la administración
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}