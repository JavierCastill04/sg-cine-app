import * as LocalAuthentication from 'expo-local-authentication';

export const biometriaDisponible = async () => {
    const tieneHardware = await LocalAuthentication.hasHardwareAsync();
    const biometriaRegistrada = await LocalAuthentication.isEnrolledAsync();

    return tieneHardware && biometriaRegistrada;
};

export const autenticarBiometria = async () => {
    const resultado = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentícate para continuar',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar contraseña'
    });

    return resultado.success;
};