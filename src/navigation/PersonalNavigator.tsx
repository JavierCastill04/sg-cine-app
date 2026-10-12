import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Film,
    Building2,
    ChartPie,
    Popcorn,
    QrCode,
    DoorOpen,
} from 'lucide-react-native';
import Peliculas from '../modules/peliculas/screens/PeliculasScreen';
import Salas from '../modules/salas/screens/SalasScreen';
import Dashboard from '../modules/dashboard/screens/DashboardScreen';
import Funciones from '../modules/funciones/screens/FuncionesScreen';
import Escaner from '../modules/escanerqr/screens/EscanerScreen';
import type { PersonalTabParamList, RootStackParamList } from './types';
import { tabScreenOptions } from './navigationSyles';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { revocarAccesoPersonal } from '../redux/slices/authSlice';
import { colores } from '../theme';


const Tab = createBottomTabNavigator<PersonalTabParamList>();

export default function PersonalNavigator() {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const autenticado = useAppSelector(state => state.auth.autenticado);


    useEffect(() => {
        if (!autenticado) { navigation.replace('Login'); }
    }, [autenticado, navigation]);

    if (!autenticado) { return null; }


const salirDePersonal = () => {
    dispatch(revocarAccesoPersonal());
};

const headerRight = () => (
    <TouchableOpacity
        onPress={salirDePersonal}
        accessibilityRole="button"
        accessibilityLabel="Salir de Personal"
        hitSlop={10}
        style={{ marginRight: 15 }}
    >
        <DoorOpen
            size={24}
            color={colores.enfasis}
        />
    </TouchableOpacity>
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