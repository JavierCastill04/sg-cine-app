import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Peliculas from '../modules/peliculas/screens/PeliculasScreen';
import Salas from '../modules/salas/screens/SalasScreen';
import Dashboard from '../modules/dashboard/screens/DashboardScreen';
import Funciones from '../modules/funciones/screens/FuncionesScreen';
import Escaner from '../modules/escanerqr/screens/EscanerScreen';
import type { PersonalTabParamList } from './types';


const Tab = createBottomTabNavigator<PersonalTabParamList>();

export default function PersonalNavigator() {
    return (
        <Tab.Navigator initialRouteName="Peliculas">
            <Tab.Screen name="Peliculas" component={Peliculas} options={{ headerShown: true }} />
            <Tab.Screen name="Salas" component={Salas} options={{ headerShown: true }} />
            <Tab.Screen name="Dashboard" component={Dashboard} options={{ headerShown: true }} />
            <Tab.Screen name="Funciones" component={Funciones} options={{ headerShown: true }} />
            <Tab.Screen name="Escaner" component={Escaner} options={{ headerShown: true }} />
        </Tab.Navigator>
    );
}