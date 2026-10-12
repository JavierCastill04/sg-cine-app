
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserPlus, ShieldCheck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import type { RootStackParamList } from '../../../navigation/types';
import { colores, commonStyles } from '../../../theme';
import { usuariosService } from '../../../services/usuarios.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Registro'>;

export default function RegisterScreen({ navigation }: Props) {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [confirmarContraseña, setConfirmarContraseña] = useState('');
    const [cargando, setCargando] = useState(false);

    const registrar = async () => {
        if (cargando) return;

        const nombreLimpio = nombre.trim();
        const correoLimpio = correo.trim().toLowerCase();

        if (
            !nombreLimpio ||
            !correoLimpio ||
            !contraseña ||
            !confirmarContraseña
        ) {
            Toast.show({
                type: 'error',
                text1: 'Campos obligatorios',
                text2: 'Completa todos los campos',
                position: 'bottom',
            });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
            Toast.show({
                type: 'error',
                text1: 'Correo inválido',
                text2: 'Ingresa un correo electrónico válido',
                position: 'bottom',
            });
            return;
        }

        if (contraseña.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Contraseña demasiado corta',
                text2: 'Utiliza al menos 8 caracteres',
                position: 'bottom',
            });
            return;
        }

        if (contraseña !== confirmarContraseña) {
            Toast.show({
                type: 'error',
                text1: 'Las contraseñas no coinciden',
                text2: 'Verifica la confirmación de contraseña',
                position: 'bottom',
            });
            return;
        }

        setCargando(true);

        try {
            await usuariosService.registrarUsuario({
                nombre: nombreLimpio,
                correo: correoLimpio,
                clave: contraseña,
            });

            Toast.show({
                type: 'success',
                text1: 'Cuenta creada correctamente',
                text2: 'Ahora puedes iniciar sesión',
                position: 'bottom',
            });

            navigation.replace('Login');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error al registrar usuario',
                text2:
                    error instanceof Error
                        ? error.message
                        : 'No se pudo crear la cuenta',
                position: 'bottom',
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <KeyboardAvoidingView
                style={commonStyles.centeredContent}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={commonStyles.centeredHeader}
                >
                    <View style={commonStyles.card}>
                        <View style={commonStyles.centeredHeader}>
                            <ShieldCheck
                                size={70}
                                color={colores.enfasis}
                            />

                            <Text style={commonStyles.title}>
                                Crear una cuenta
                            </Text>

                            <Text style={commonStyles.secondaryText}>
                                Regístrate para disfrutar de SG Cine
                            </Text>
                        </View>

                        <View style={commonStyles.inputView}>
                            <Text style={commonStyles.label}>
                                Nombre completo
                            </Text>

                            <TextInput
                                style={commonStyles.input}
                                placeholder="Ingresa tu nombre"
                                placeholderTextColor={colores.textoSecundario}
                                value={nombre}
                                onChangeText={setNombre}
                                autoCapitalize="words"
                                autoCorrect={false}
                                autoComplete="name"
                            />
                        </View>

                        <View style={commonStyles.inputView}>
                            <Text style={commonStyles.label}>
                                Correo electrónico
                            </Text>

                            <TextInput
                                style={commonStyles.input}
                                placeholder="Ingresa tu correo"
                                placeholderTextColor={colores.textoSecundario}
                                value={correo}
                                onChangeText={setCorreo}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                autoComplete="email"
                            />
                        </View>

                        <View style={commonStyles.inputView}>
                            <Text style={commonStyles.label}>
                                Contraseña
                            </Text>

                            <TextInput
                                style={commonStyles.input}
                                placeholder="Ingresa tu contraseña"
                                placeholderTextColor={colores.textoSecundario}
                                value={contraseña}
                                onChangeText={setContraseña}
                                secureTextEntry
                                autoCapitalize="none"
                                autoComplete="new-password"
                            />
                        </View>

                        <View style={commonStyles.inputView}>
                            <Text style={commonStyles.label}>
                                Confirmar contraseña
                            </Text>

                            <TextInput
                                style={commonStyles.input}
                                placeholder="Repite tu contraseña"
                                placeholderTextColor={colores.textoSecundario}
                                value={confirmarContraseña}
                                onChangeText={setConfirmarContraseña}
                                secureTextEntry
                                autoCapitalize="none"
                                autoComplete="new-password"
                            />
                        </View>

                        <View style={commonStyles.verticalButtons}>
                            <TouchableOpacity
                                style={[
                                    commonStyles.button,
                                    commonStyles.buttonWithIcon,
                                ]}
                                onPress={registrar}
                                disabled={cargando}
                            >
                                <UserPlus size={20} color={colores.negro} />

                                <Text style={commonStyles.buttonText}>
                                    {cargando
                                        ? 'Creando cuenta...'
                                        : 'Crear cuenta'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    commonStyles.button,
                                    commonStyles.dangerButton,
                                ]}
                                onPress={() => navigation.goBack()}
                                disabled={cargando}
                            >
                                <Text style={commonStyles.dangerButtonText}>
                                    Volver
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
