import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../modules/home/screens/HomeScreen';
import ClienteNavigator from './ClienteNavigator';
import PersonalNavigator from './PersonalNavigator';
import LoginScreen from '../modules/auth/screens/LoginScreen';
import ReservaScreen from '../modules/reserva/screens/ReservaScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: true }} />
            <Stack.Screen name="ClienteNavigator" component={ClienteNavigator} options={{ headerShown: true}} />
            <Stack.Screen name="PersonalNavigator" component={PersonalNavigator} options={{ headerShown: true}} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: true }} />
            <Stack.Screen name="Reserva" component={ReservaScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
    );
}