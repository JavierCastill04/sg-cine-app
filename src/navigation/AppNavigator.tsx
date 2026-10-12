
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../modules/home/screens/HomeScreen';
import ClienteNavigator from './ClienteNavigator';
import PersonalNavigator from './PersonalNavigator';
import ReservaScreen from '../modules/reserva/screens/ReservaScreen';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import RegisterScreen from '../modules/auth/screens/RegisterScreen';
import { useAppSelector } from '../redux/hooks';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const {
        autenticado,
        usuario,
        accesoPersonalAutorizado,
    } = useAppSelector(state => state.auth);

    const accesoPermitido =
        autenticado &&
        usuario?.rol === 'personal' &&
        accesoPersonalAutorizado;

    return (
        <Stack.Navigator
            initialRouteName="ClienteNavigator"
            screenOptions={{ animation: 'none' }}
        >
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ClienteNavigator"
                component={ClienteNavigator}
                options={{ headerShown: false }}
            />

            {accesoPermitido && (
                <Stack.Screen
                    name="PersonalNavigator"
                    component={PersonalNavigator}
                    options={{ headerShown: false }}
                />
            )}

            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
             <Stack.Screen
    name="Registro"
    component={RegisterScreen}
    options={{ headerShown: false }}
/>
            <Stack.Screen
                name="Reserva"
                component={ReservaScreen}
                options={{
                    headerShown: false,
                    presentation: 'card',
                }}
            />
        </Stack.Navigator>
    );
}
