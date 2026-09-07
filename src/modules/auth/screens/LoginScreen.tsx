import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LogIn, ShieldCheck } from "lucide-react-native";
import type { RootStackParamList } from "../../../navigation/types";
import { colores, commonStyles } from "../../../theme";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { login } from "../../../redux/slices/authSlice";
import { usuariosData } from "../../../data/usuariosData";
import { Fingerprint } from "lucide-react-native";
import { autenticarBiometria } from "../../auth/utils/biometria";
import Toast from "react-native-toast-message";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
    const dispatch = useAppDispatch();
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const biometriaActiva = useAppSelector(state => state.auth.biometriaActiva);
    const usuarioBiometria = useAppSelector(state => state.auth.usuarioBiometria);

    const iniciarSesion = () => {
        const usuarioEncontrado = usuariosData.find(usuarioData => usuarioData.usuario === usuario && usuarioData.contraseña === contraseña);

        if (!usuarioEncontrado) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Usuario o contraseña incorrectos', position: 'bottom', visibilityTime: 1500, bottomOffset: 100 });
            return;
        }

        const { contraseña: _, ...usuarioSinContraseña } = usuarioEncontrado;

        dispatch(login(usuarioSinContraseña));
        navigation.replace("PersonalNavigator");
    };

    const iniciarConBiometria = async () => {
        if (!usuarioBiometria) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'No hay usuario configurado para autenticación biométrica', position: 'bottom', visibilityTime: 1500, bottomOffset: 100 });
            return;
        }

        const autenticado = await autenticarBiometria();

        if (!autenticado) { return; }

        dispatch(login(usuarioBiometria));
        navigation.replace("PersonalNavigator");
    };

    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <View style={{ flex: 1, justifyContent: "center" }}>
                <View style={commonStyles.card}>
                    <View style={{ alignItems: "center", marginBottom: 30 }}>
                        <ShieldCheck size={70} color={colores.enfasis} />

                        <Text
                            style={[
                                commonStyles.title,
                                {
                                    marginTop: 15,
                                    marginBottom: 5,
                                    textAlign: "center"
                                }
                            ]}
                        >
                            Área personal
                        </Text>

                        <Text style={commonStyles.secondaryText}>Inicia sesión para continuar</Text>
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>Usuario</Text>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="Ingresa tu usuario"
                            placeholderTextColor={colores.textoSecundario}
                            value={usuario}
                            onChangeText={setUsuario}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={commonStyles.inputView}>
                        <Text style={commonStyles.label}>Contraseña</Text>
                        <TextInput
                            style={commonStyles.input}
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor={colores.textoSecundario}
                            value={contraseña}
                            onChangeText={setContraseña}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.botonesContainer}>
                        <TouchableOpacity style={[commonStyles.button, { flexDirection: "row" }]} onPress={iniciarSesion}>
                            <LogIn size={20} />
                            <Text style={[commonStyles.buttonText, { marginLeft: 8 }]}>Iniciar sesión</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[commonStyles.button, { backgroundColor: colores.rojo }]} onPress={() => navigation.goBack()} >
                            <Text style={commonStyles.modalButtonCancelarText}>Volver</Text>
                        </TouchableOpacity>
                        {biometriaActiva && (
                            <TouchableOpacity style={[commonStyles.button, { flexDirection: "row",backgroundColor: colores.verde }]} onPress={iniciarConBiometria} >
                                <Fingerprint size={20} />
                                <Text style={[commonStyles.buttonText, { marginLeft: 8 }]}> Entrar con biometría</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    botonesContainer: {
        flexDirection: 'column',
        marginTop: 20,
        gap: 10
    }
})