import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LogIn, ShieldCheck } from "lucide-react-native";
import type { RootStackParamList } from "../../../navigation/types";
import { colores, commonStyles } from "../../../theme";
import { useAppDispatch } from "../../../redux/hooks";
import { login } from "../../../redux/slices/authSlice";
import { usuariosData } from "../../../data/usuariosData";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
    const dispatch = useAppDispatch();

    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");

    const iniciarSesion = () => {
        const usuarioEncontrado = usuariosData.find(usuarioData => usuarioData.usuario === usuario && usuarioData.contraseña === contraseña);

        if (!usuarioEncontrado) {
            Alert.alert(
                "Error",
                "El usuario o la contraseña son incorrectos."
            );
            return;
        }

        const { contraseña: _, ...usuarioSinContraseña } = usuarioEncontrado;

        dispatch(login(usuarioSinContraseña));
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