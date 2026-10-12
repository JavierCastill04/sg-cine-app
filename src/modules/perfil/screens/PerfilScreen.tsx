
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Switch,
    Alert,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    UserRound,
    LogIn,
    LogOut,
    ShieldCheck,
    UserPlus,
} from 'lucide-react-native';
import { notificacionesService } from '../../../services/notificaciones.service';
import type { RootStackParamList } from '../../../navigation/types';
import { commonStyles, colores } from '../../../theme';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { logout } from '../../../redux/slices/authSlice';
import { eliminarToken } from '../../../services/secureStorage';
import { limpiarVentas } from '../../../redux/slices/ventaSlice';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const CLAVE_MODO_DEMOSTRACION = '@sgcine:modoDemostracionNotificaciones';

export default function PerfilScreen() {
    const navigation = useNavigation<Navigation>();
    const dispatch = useAppDispatch();

    const { autenticado, usuario } = useAppSelector(state => state.auth);

    const esPersonal = usuario?.rol === 'personal';

    const [modoDemostracion, setModoDemostracion] = useState(false);
    const [cargandoPreferencia, setCargandoPreferencia] = useState(true);

    useEffect(() => {
        let activo = true;

        const cargarPreferencia = async () => {
            try {
                const valor = await AsyncStorage.getItem(
                    CLAVE_MODO_DEMOSTRACION
                );

                if (activo) {
                    setModoDemostracion(valor === 'true');
                }
            } catch (error) {
                console.error(
                    'Error al cargar el modo demostración:',
                    error
                );
            } finally {
                if (activo) {
                    setCargandoPreferencia(false);
                }
            }
        };

        cargarPreferencia();

        return () => {
            activo = false;
        };
    }, []);

    const cambiarModoDemostracion = async (activado: boolean) => {
        try {
            await AsyncStorage.setItem(
                CLAVE_MODO_DEMOSTRACION,
                String(activado)
            );

            setModoDemostracion(activado);
        } catch (error) {
            console.error(
                'Error al guardar el modo demostración:',
                error
            );

            Alert.alert(
                'Error',
                'No se pudo guardar la configuración de notificaciones.'
            );
        }
    };

const cerrarSesion = async () => {
    try {
        await eliminarToken();

        try {
            await notificacionesService.cancelarTodosLosRecordatorios();
        } catch (error) {
            console.error(
                'No se pudieron cancelar los recordatorios:',
                error
            );
        }

        dispatch(limpiarVentas());
        dispatch(logout());
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
};

    return (
    <SafeAreaView style={commonStyles.containerScreen}>
        <ScrollView
            contentContainerStyle={commonStyles.perfilScrollContenido}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
                <View style={commonStyles.centeredHeader}>
                    <UserRound size={65} color={colores.enfasis} />

                    <Text style={commonStyles.title}>
                        Mi Perfil
                    </Text>

                    <Text style={commonStyles.secondaryText}>
                        {autenticado
                            ? 'Información de tu cuenta'
                            : 'Bienvenido a Cine App'}
                    </Text>
                </View>

                {!autenticado ? (
                    <View style={commonStyles.card}>
                        <Text style={commonStyles.cardTitle}>
                            Invitado
                        </Text>

                        <Text style={commonStyles.secondaryText}>
                            Inicia sesión para acceder a tu cuenta.
                        </Text>

                        <TouchableOpacity
                            style={[
                                commonStyles.button,
                                commonStyles.profileButton,
                            ]}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <LogIn size={20} color={colores.negro} />

                            <Text style={commonStyles.buttonText}>
                                Iniciar sesión
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                commonStyles.button,
                                commonStyles.profileButton,
                            ]}
                            onPress={() => navigation.navigate('Registro')}
                            accessibilityRole="button"
                            accessibilityLabel="Crear una cuenta"
                        >
                            <UserPlus size={20} color={colores.negro} />

                            <Text style={commonStyles.buttonText}>
                                Crear una cuenta
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={commonStyles.card}>
                            <Text style={commonStyles.cardTitle}>
                                {usuario?.nombre}
                            </Text>

                            <Text style={commonStyles.secondaryText}>
                                Usuario: {usuario?.correo}
                            </Text>

                            <Text style={commonStyles.secondaryText}>
                                Tipo de cuenta: {esPersonal ? 'Personal' : 'Cliente'}
                            </Text>

                            {esPersonal && (
                                <TouchableOpacity
                                    style={[
                                        commonStyles.button,
                                        commonStyles.profileButton,
                                    ]}
                                    onPress={() => navigation.navigate('Home')}
                                >
                                    <ShieldCheck
                                        size={20}
                                        color={colores.negro}
                                    />

                                    <Text style={commonStyles.buttonText}>
                                        Acceso administrativo
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[
                                    commonStyles.button,
                                    commonStyles.profileButton,
                                    commonStyles.dangerButton,
                                ]}
                                onPress={cerrarSesion}
                            >
                                <LogOut size={20} color={colores.blanco} />

                                <Text style={commonStyles.dangerButtonText}>
                                    Cerrar sesión
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View
                            style={[
                                commonStyles.card,
                                commonStyles.perfilNotificacionesCard,
                            ]}
                        >
                            <Text style={commonStyles.cardTitle}>
                                Notificaciones
                            </Text>

                            <View style={commonStyles.perfilNotificacionesFila}>
                                <View
                                    style={commonStyles.perfilNotificacionesContenido}
                                >
                                    <Text
                                        style={commonStyles.perfilNotificacionesTitulo}
                                    >
                                        Modo demostración
                                    </Text>

                                    <Text
                                        style={commonStyles.perfilNotificacionesDescripcion}
                                    >
                                        {modoDemostracion
                                            ? 'Los nuevos recordatorios se programarán para un minuto después de la compra.'
                                            : 'Los nuevos recordatorios se programarán 60 minutos antes de la función.'}
                                    </Text>
                                </View>

                                <Switch
                                    value={modoDemostracion}
                                    onValueChange={cambiarModoDemostracion}
                                    disabled={cargandoPreferencia}
                                    trackColor={{
                                        false: colores.borde,
                                        true: colores.enfasis,
                                    }}
                                    thumbColor={colores.blanco}
                                    accessibilityLabel="Activar modo demostración de notificaciones"
                                />
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
