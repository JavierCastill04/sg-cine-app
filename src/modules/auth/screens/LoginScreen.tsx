
import { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogIn, ShieldCheck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import type { RootStackParamList } from '../../../navigation/types';
import { colores, commonStyles } from '../../../theme';
import { useAppDispatch } from '../../../redux/hooks';
import { login } from '../../../redux/slices/authSlice';
import { usuariosData } from '../../../data/usuariosData';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const dispatch = useAppDispatch();

    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');

    const iniciarSesion = () => {
        const nombreUsuario = usuario.trim().toLowerCase();

        if (!nombreUsuario || !contraseña) {
            Toast.show({
                type: 'error',
                text1: 'Campos obligatorios',
                text2: 'Ingresa tu usuario y contraseña',
                position: 'bottom',
            });
            return;
        }

        const usuarioEncontrado = usuariosData.find(
            item =>
                item.usuario.toLowerCase() === nombreUsuario &&
                item.contraseña === contraseña
        );

        if (!usuarioEncontrado) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Usuario o contraseña incorrectos',
                position: 'bottom',
            });
            return;
        }

        const { contraseña: _, ...usuarioSinContraseña } =
            usuarioEncontrado;

        dispatch(login(usuarioSinContraseña));

        Toast.show({
            type: 'success',
            text1: 'Sesión iniciada',
            text2: `Bienvenido, ${usuarioEncontrado.nombre}`,
            position: 'bottom',
        });

        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.replace('ClienteNavigator');
        }
    };

    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <View style={commonStyles.centeredContent}>
                <View style={commonStyles.card}>
                    <View style={commonStyles.centeredHeader}>
                        <ShieldCheck
                            size={70}
                            color={colores.enfasis}
                        />

                        <Text style={commonStyles.title}>
                            Iniciar sesión
                        </Text>

                        <Text style={commonStyles.secondaryText}>
                            Accede a tu cuenta de Cine App
                        </Text>
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>
                            Usuario
                        </Text>

                        <TextInput
                            style={commonStyles.input}
                            placeholder="Ingresa tu usuario"
                            placeholderTextColor={
                                colores.textoSecundario
                            }
                            value={usuario}
                            onChangeText={setUsuario}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>
                            Contraseña
                        </Text>

                        <TextInput
                            style={commonStyles.input}
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor={
                                colores.textoSecundario
                            }
                            value={contraseña}
                            onChangeText={setContraseña}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={commonStyles.verticalButtons}>
                        <TouchableOpacity
                            style={[
                                commonStyles.button,
                                commonStyles.buttonWithIcon,
                            ]}
                            onPress={iniciarSesion}
                        >
                            <LogIn
                                size={20}
                                color={colores.negro}
                            />

                            <Text style={commonStyles.buttonText}>
                                Iniciar sesión
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                commonStyles.button,
                                commonStyles.dangerButton,
                            ]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={commonStyles.dangerButtonText}>
                                Volver
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
