import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Cartelera from '../modules/cartelera/screens/CarteleraScreen';
import Boletos from '../modules/boletos/screens/BoletosScreen';
import type { ClienteTabParamList } from './types';

const Tab = createBottomTabNavigator<ClienteTabParamList>();

export default function ClienteNavigator() {
    return (
        <Tab.Navigator initialRouteName="Cartelera" >
            <Tab.Screen name="Cartelera" component={Cartelera} options={{ headerShown: true }} />
            <Tab.Screen name="Boletos" component={Boletos} options={{ headerShown: true }} />
        </Tab.Navigator>
    );
}