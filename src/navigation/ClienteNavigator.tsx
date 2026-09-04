import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Cartelera from '../modules/cartelera/screens/CarteleraScreen';
import Boletos from '../modules/boletos/screens/BoletosScreen';
import type { ClienteTabParamList } from './types';
import { tabScreenOptions } from './navigationSyles';
import { Film, Ticket } from 'lucide-react-native';

const Tab = createBottomTabNavigator<ClienteTabParamList>();

export default function ClienteNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Cartelera"
            screenOptions={({ route }) => ({
                ...tabScreenOptions,

                tabBarIcon: ({ color, size }) => {
                    switch (route.name) {
                        case 'Cartelera':
                            return <Film color={color} size={size} />;

                        case 'Boletos':
                            return <Ticket color={color} size={size} />;

                        default:
                            return null;
                    }
                }
            })}
        >
            <Tab.Screen name="Cartelera" component={Cartelera} />
            <Tab.Screen name="Boletos" component={Boletos} options={{headerTitle: 'Mis Boletos'}} />
        </Tab.Navigator>
    );
}