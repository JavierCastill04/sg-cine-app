import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserRound, LogIn, LogOut, ShieldCheck, UserPlus } from 'lucide-react-native';
import type { RootStackParamList } from '../../../navigation/types';
import { commonStyles, colores } from '../../../theme';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { logout } from '../../../redux/slices/authSlice';
import { eliminarToken } from '../../../services/secureStorage';

type Navigation = NativeStackNavigationProp<RootStackParamList>;

export default function PerfilScreen() {
    const navigation = useNavigation<Navigation>();
    const dispatch = useAppDispatch();
    const { autenticado, usuario } = useAppSelector(state => state.auth);

    const esPersonal = usuario?.rol === 'personal';

    const cerrarSesion = async () => {
        try {
            await eliminarToken();
            dispatch(logout());
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <View style={commonStyles.centeredContent}>
                <View style={commonStyles.centeredHeader}>
                    <UserRound size={65} color={colores.enfasis} />

                    <Text style={commonStyles.title}>Mi Perfil</Text>

                    <Text style={commonStyles.secondaryText}>
                        {autenticado
                            ? 'Información de tu cuenta'
                            : 'Bienvenido a Cine App'}
                    </Text>
                </View>

                {!autenticado ? (
                    <View style={commonStyles.card}>
                        <Text style={commonStyles.cardTitle}>Invitado</Text>

                        <Text style={commonStyles.secondaryText}>
                            Inicia sesión para acceder a tu cuenta.
                        </Text>

                        <TouchableOpacity
                            style={[commonStyles.button, commonStyles.profileButton]}
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
    <UserPlus
        size={20}
        color={colores.negro}
    />

    <Text style={commonStyles.buttonText}>
        Crear una cuenta
    </Text>
</TouchableOpacity>

                    </View>
                ) : (
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
                                style={[commonStyles.button, commonStyles.profileButton]}
                                onPress={() => navigation.navigate('Home')}
                            >
                                <ShieldCheck size={20} color={colores.negro} />
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
                )}
            </View>
        </SafeAreaView>
    );
}