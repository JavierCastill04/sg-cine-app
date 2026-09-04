import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Peliculas from '../modules/peliculas/screens/PeliculasScreen';
import Salas from '../modules/salas/screens/SalasScreen';
import Dashboard from '../modules/dashboard/screens/DashboardScreen';
import Funciones from '../modules/funciones/screens/FuncionesScreen';
import Escaner from '../modules/escanerqr/screens/EscanerScreen';
import type { PersonalTabParamList } from './types';
import { tabScreenOptions } from './navigationSyles';
import { Film, Building2, ChartPie, Popcorn, QrCode } from 'lucide-react-native';


const Tab = createBottomTabNavigator<PersonalTabParamList>();

export default function PersonalNavigator() {
    return (
        <Tab.Navigator initialRouteName="Peliculas"
            screenOptions={({ route }) => ({
                ...tabScreenOptions,
                tabBarIcon: ({ color, size }) => {
                    switch (route.name) {
                        case 'Peliculas':
                            return <Film color={color} size={size} />;

                        case 'Salas':
                            return <Building2 color={color} size={size} />;

                        case 'Dashboard':
                            return <ChartPie color={color} size={size} />;

                        case 'Funciones':
                            return <Popcorn color={color} size={size} />;

                        case 'Escaner':
                            return <QrCode color={color} size={size} />;

                        default:
                            return null;
                    }
                },
            })}>
            <Tab.Screen name="Peliculas" component={Peliculas} options={{headerTitle: 'Gestión de Películas'}} />
            <Tab.Screen name="Salas" component={Salas} options={{headerTitle: 'Gestión de Salas'}} />
            <Tab.Screen name="Dashboard" component={Dashboard} options={{headerTitle: 'Dashboard y estadísticas'}} />
            <Tab.Screen name="Funciones" component={Funciones} options={{headerTitle: 'Gestión de Funciones'}} />
            <Tab.Screen name="Escaner" component={Escaner} options={{headerTitle: 'Validación de boletos'}} />
        </Tab.Navigator>
    );
}