import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { colores } from '../theme';

export const tabScreenOptions: BottomTabNavigationOptions = {
    headerStyle: {
        backgroundColor: colores.primario,
    },

    headerTintColor: colores.superficie,

    headerTitleStyle: {
        fontWeight: '700',
    },

    tabBarActiveTintColor: colores.enfasis,
    tabBarInactiveTintColor: colores.claro,

    tabBarStyle: {
        backgroundColor: colores.secundario,
        borderTopWidth: 0,
    },

    tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
    },
    tabBarIconStyle: {
        marginTop: -2,
    },
};