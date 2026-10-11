
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Film, Ticket, UserRound } from 'lucide-react-native';

import Cartelera from '../modules/cartelera/screens/CarteleraScreen';
import Boletos from '../modules/boletos/screens/BoletosScreen';
import Perfil from '../modules/perfil/screens/PerfilScreen';

import type { ClienteTabParamList } from './types';
import { tabScreenOptions } from './navigationSyles';

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
                            return (
                                <Film
                                    color={color}
                                    size={size}
                                />
                            );

                        case 'Boletos':
                            return (
                                <Ticket
                                    color={color}
                                    size={size}
                                />
                            );

                        case 'Perfil':
                            return (
                                <UserRound
                                    color={color}
                                    size={size}
                                />
                            );

                        default:
                            return null;
                    }
                },

                animation: 'none',
            })}
        >
            <Tab.Screen
                name="Cartelera"
                component={Cartelera}
            />

            <Tab.Screen
                name="Boletos"
                component={Boletos}
                options={{
                    headerTitle: 'Mis Boletos',
                }}
            />

            <Tab.Screen
                name="Perfil"
                component={Perfil}
                options={{
                    headerTitle: 'Mi Perfil',
                }}
            />
        </Tab.Navigator>
    );
}
