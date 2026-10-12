
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/toast/ToastPersonalizado';
import AppNavigator from './src/navigation/AppNavigator';
import { store, persistor, type RootState, type AppDispatch } from './src/redux/store';
import { restaurarSesion, logout } from './src/redux/slices/authSlice';
import { obtenerToken, eliminarToken } from './src/services/secureStorage';

function ContenidoApp() {
  const dispatch = useDispatch<AppDispatch>();
  const usuario = useSelector((state: RootState) => state.auth.usuario);
  const [sesionVerificada, setSesionVerificada] = useState(false);

  useEffect(() => {
    let cancelado = false;

    const restaurar = async () => {
      try {
        const token = await obtenerToken();

        if (cancelado) return;
        if (token && usuario) { dispatch(restaurarSesion(token)); }
        else {
          if (token) await eliminarToken();
          if (cancelado) return;
          dispatch(logout());
        }
      } catch (error) {
        console.error('Error al restaurar la sesión:', error);
        if (!cancelado) dispatch(logout());
      } finally {
        if (!cancelado) setSesionVerificada(true);
      }
    };

    void restaurar();

    return () => {
      cancelado = true;
    };
  }, [dispatch, usuario]);

  if (!sesionVerificada) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <Toast
    config={toastConfig}
    position="bottom"
    bottomOffset={45}
    visibilityTime={3500}
/>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ContenidoApp />
      </PersistGate>
    </Provider>
  );
}