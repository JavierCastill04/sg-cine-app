import { useEffect } from 'react';
import Toast from 'react-native-toast-message'
import { Alert, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Film, Building2, ChartPie, Popcorn, QrCode, User, Lock, LockOpen } from 'lucide-react-native';
import Peliculas from '../modules/peliculas/screens/PeliculasScreen';
import Salas from '../modules/salas/screens/SalasScreen';
import Dashboard from '../modules/dashboard/screens/DashboardScreen';
import Funciones from '../modules/funciones/screens/FuncionesScreen';
import Escaner from '../modules/escanerqr/screens/EscanerScreen';
import type { PersonalTabParamList, RootStackParamList } from './types';
import { tabScreenOptions } from './navigationSyles';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { activarBiometria, desactivarBiometria, logout } from '../redux/slices/authSlice';
import { autenticarBiometria, biometriaDisponible } from '../modules/auth/utils/biometria';
import { colores } from '../theme';


const Tab = createBottomTabNavigator<PersonalTabParamList>();

export default function PersonalNavigator() {
    const dispatch = useAppDispatch();
    const usuario = useAppSelector(state => state.auth.usuario);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const autenticado = useAppSelector(state => state.auth.autenticado);
    const biometriaActiva = useAppSelector(state => state.auth.biometriaActiva);


    useEffect(() => {
        if (!autenticado) { navigation.replace('Login'); }
    }, [autenticado, navigation]);

    if (!autenticado) { return null; }

    const configurarBiometria = async () => {

        if (!usuario) { return; }
        const autenticado = await autenticarBiometria();
        const disponible = await biometriaDisponible();
        if (biometriaActiva) {
            dispatch(desactivarBiometria());
            Toast.show({ type: 'error', text1: 'Biometría desactivada', position: 'bottom', visibilityTime: 1500, bottomOffset: 100 });
            return;
        }
        
        if (!autenticado) {
            Toast.show({ type: 'error', text1: 'Autenticación fallida', text2: 'No se pudo verificar tu identidad.', position: 'bottom', visibilityTime: 1500, bottomOffset: 100 });
            return;
        }

        if (!disponible) {
            Toast.show({ type: 'error', text1: 'Biometría no disponible', text2: 'Configura un método biométrico en tu dispositivo.', position: 'bottom', visibilityTime: 1500, bottomOffset: 100 });
            return;
        }

        dispatch(activarBiometria(usuario));
        Toast.show({ type: 'success', text1: 'Biometría activada', position: 'bottom', visibilityTime: 1500, bottomOffset: 100 });
    };

    const cerrarSesion = () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que deseas cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: () => dispatch(logout())
                }
            ]
        );
    };

    const headerRight = () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, marginRight: 15 }}>
            <TouchableOpacity onPress={configurarBiometria}>
                {biometriaActiva === true && (
                    <Lock
                        size={24}
                        color={colores.enfasis}
                    />
                )}
                {biometriaActiva === false && (
                    <LockOpen
                        size={24}
                        color={colores.textoSecundario}
                    />
                )}

            </TouchableOpacity>

            <TouchableOpacity onPress={cerrarSesion}>
                <User size={24} color={colores.enfasis} />
            </TouchableOpacity>
        </View>
    );

    return (
        <Tab.Navigator
            initialRouteName="Peliculas"
            screenOptions={({ route }) => ({
                ...tabScreenOptions,
                headerRight,
                tabBarIcon: ({ color, size }) => {
                    switch (route.name) {
                        case 'Peliculas': return <Film color={color} size={size} />;
                        case 'Salas': return <Building2 color={color} size={size} />;
                        case 'Dashboard': return <ChartPie color={color} size={size} />;
                        case 'Funciones': return <Popcorn color={color} size={size} />;
                        case 'Escaner': return <QrCode color={color} size={size} />;
                        default: return null;
                    }
                },
                animation: 'none'
            })}
        >
            <Tab.Screen name="Peliculas" component={Peliculas} options={{ headerTitle: 'Gestión de Películas' }} />
            <Tab.Screen name="Salas" component={Salas} options={{ headerTitle: 'Gestión de Salas' }} />
            <Tab.Screen name="Funciones" component={Funciones} options={{ headerTitle: 'Gestión de Funciones' }} />
            <Tab.Screen name="Dashboard" component={Dashboard} options={{ headerTitle: 'Dashboard y estadísticas' }} />
            <Tab.Screen name="Escaner" component={Escaner} options={{ headerTitle: 'Validación de boletos' }} />
        </Tab.Navigator>
    );
}