import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../../../navigation/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { commonStyles, colores } from '../../../theme';
import { ShieldCheck } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <View style={{ flex: 1, justifyContent: 'center' }}>

                {/* Encabezado */}
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                    <ShieldCheck
                        size={60}
                        color={colores.enfasis}
                    />

                    <Text
                        style={[
                            commonStyles.title,
                            {
                                color: colores.enfasis,
                                textAlign: 'center',
                                marginTop: 15,
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
                        Acceso de personal
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
                        Ingresa al área de administración
                    </Text>
                </View>

                {/* Botón de acceso */}
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
                    onPress={() => navigation.navigate('PersonalNavigator')}
                >
                    <ShieldCheck
                        size={22}
                        color={colores.negro}
                    />

                    <Text
                        style={[
                            commonStyles.buttonText,
                            {
                                color: colores.negro,
                                marginLeft: 10,
                            },
                        ]}
                    >
                        Entrar a Personal
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}