import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LogIn, ShieldCheck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import type { RootStackParamList } from '../../../navigation/types';
import { colores, commonStyles } from '../../../theme';
import { useAppDispatch } from '../../../redux/hooks';
import { login } from '../../../redux/slices/authSlice';
import { usuariosService } from '../../../services/usuarios.service';
import { guardarToken } from '../../../services/secureStorage';
import { notificacionesService } from '../../../services/notificaciones.service';
import { dispositivosService } from '../../../services/dispositivos.service';
import { ApiError } from '../../../services/api';
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
const registrarDispositivoPush = async (): Promise<void> => {
    try {
        const expoPushToken =
            await notificacionesService.obtenerExpoPushToken();

        if (!expoPushToken) {
            console.warn(
                'No se obtuvo un Expo Push Token para registrar el dispositivo.'
            );
            return;
        }

        const respuesta = await dispositivosService.registrar(expoPushToken);

        console.log('Registro de dispositivo push:', respuesta.message);
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Error al registrar dispositivo push:', {
                status: error.status,
                mensaje: error.message,
            });
        } else {
            console.error(
                'No se pudo registrar el dispositivo para notificaciones push:',
                error
            );
        }
    }
};
export default function LoginScreen({ navigation, route }: Props) {
    const dispatch = useAppDispatch();
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [cargando, setCargando] = useState(false);
    const funcionId = route.params?.funcionId;

    const iniciarSesion = async () => {
        if (cargando) return;

        const correo = usuario.trim().toLowerCase();

        if (!correo || !contraseña) {
            Toast.show({
                type: 'error',
                text1: 'Campos obligatorios',
                text2: 'Ingresa tu correo y contraseña',
                position: 'bottom',
            });
            return;
        }

        setCargando(true);

        try {
            const respuesta = await usuariosService.iniciarSesion({
                correo,
                clave: contraseña,
            });

            const usuarioAutenticado = {
                id: respuesta.usuario.id,
                correo: respuesta.usuario.correo,
                nombre: respuesta.usuario.nombre,
                rol: respuesta.usuario.rol,
            };

            await guardarToken(respuesta.token);

            dispatch(login({
                usuario: usuarioAutenticado,
                token: respuesta.token,
            }));
            void registrarDispositivoPush();

            Toast.show({
                type: 'success',
                text1: 'Sesión iniciada',
                text2: `Bienvenido, ${respuesta.usuario.nombre}`,
                position: 'bottom',
            });

            if (funcionId !== undefined) {
                navigation.replace('Reserva', {
                    funcionId,
                    pasoInicial: 2,
                });
                return;
            }

            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.replace('ClienteNavigator');
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al iniciar sesión',
                text2: error instanceof Error
                    ? error.message
                    : 'No se pudo iniciar sesión',
                position: 'bottom',
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <View style={commonStyles.centeredContent}>
                <View style={commonStyles.card}>
                    <View style={commonStyles.centeredHeader}>
                        <ShieldCheck size={70} color={colores.enfasis} />
                        <Text style={commonStyles.title}>Iniciar sesión</Text>
                        <Text style={commonStyles.secondaryText}>
                            Accede a tu cuenta de Cine App
                        </Text>
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>Correo electrónico</Text>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="Ingresa tu correo"
                            placeholderTextColor={colores.textoSecundario}
                            value={usuario}
                            onChangeText={setUsuario}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>Contraseña</Text>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor={colores.textoSecundario}
                            value={contraseña}
                            onChangeText={setContraseña}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={commonStyles.verticalButtons}>
                        <TouchableOpacity
                            style={[commonStyles.button, commonStyles.buttonWithIcon]}
                            onPress={iniciarSesion}
                            disabled={cargando}
                        >
                            <LogIn size={20} color={colores.negro} />
                            <Text style={commonStyles.buttonText}>
                                {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[commonStyles.button, commonStyles.dangerButton]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={commonStyles.dangerButtonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}