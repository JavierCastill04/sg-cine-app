import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../modules/home/screens/HomeScreen';
import ClienteNavigator from './ClienteNavigator';
import PersonalNavigator from './PersonalNavigator';
import PrivateScreen from '../modules/auth/screens/PrivateScreen';
import ReservaScreen from '../modules/reserva/screens/ReservaScreen';
import type { RootStackParamList } from './types';
import LoginScreen from '../modules/auth/screens/LoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ animation: 'none' }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="ClienteNavigator" component={ClienteNavigator} options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="PersonalNavigator" component={PersonalNavigator} options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="Private" component={PrivateScreen} options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false, animation: 'none' }} />
            <Stack.Screen name="Reserva" component={ReservaScreen} options={{ headerShown: false, animation: "none", presentation: "card" }} />
        </Stack.Navigator>
    );
}