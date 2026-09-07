import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import {
    CameraView,
    useCameraPermissions
} from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { marcarTokenUsado } from "../../../redux/slices/ventaSlice";
import { colores } from "../../../theme";

export default function EscanerScreen() {
    const [permission, requestPermission] = useCameraPermissions();

    const ventas = useAppSelector(state => state.venta);
    const dispatch = useAppDispatch();

    const [escaneado, setEscaneado] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [valido, setValido] = useState<boolean | null>(null);

    const manejarEscaneo = ({ data }: { data: string }) => {
        if (escaneado) {
            return;
        }

        setEscaneado(true);

        const token = data.trim();

        const venta = ventas.find(venta => venta.token === token);

        if (!venta) {
            setValido(false);
            setMensaje("Boleto inválido");
            return;
        }

        const estaVencido =
            new Date(venta.tokenExpira).getTime() <= Date.now();

        if (venta.tokenUsado) {
            setValido(false);
            setMensaje("Boleto ya utilizado");
            return;
        }

        if (estaVencido) {
            setValido(false);
            setMensaje("Boleto vencido");
            return;
        }

        dispatch(marcarTokenUsado(token));

        setValido(true);
        setMensaje("Boleto válido");
    };

    const escanearOtro = () => {
        setEscaneado(false);
        setMensaje("");
        setValido(null);
    };

    if (!permission) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator
                    size="large"
                    color={colores.enfasis}
                />
            </SafeAreaView>
        );
    }

    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permisoContainer}>
                    <Text style={styles.titulo}>
                        Acceso a la cámara
                    </Text>

                    <Text style={styles.descripcion}>
                        Necesitamos acceder a la cámara para escanear
                        y validar los boletos.
                    </Text>

                    <Pressable
                        style={styles.boton}
                        onPress={requestPermission}
                    >
                        <Text style={styles.botonTexto}>
                            Permitir cámara
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.titulo}>
                Validación de boletos
            </Text>

            <Text style={styles.descripcion}>
                Escanea el código QR del boleto del cliente.
            </Text>

            <View style={styles.scannerContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    active={true}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"]
                    }}
                    onBarcodeScanned={
                        escaneado ? undefined : manejarEscaneo
                    }
                    onMountError={(error) => {
                        console.log(
                            "Error al iniciar cámara:",
                            error.message
                        );

                        setMensaje(
                            `Error de cámara: ${error.message}`
                        );

                        setValido(false);
                    }}
                    onCameraReady={() => {
                        console.log("Cámara lista");
                    }}
                />

                <View style={styles.marco}>
                    <View
                        style={[
                            styles.esquina,
                            styles.esquinaSuperiorIzquierda
                        ]}
                    />

                    <View
                        style={[
                            styles.esquina,
                            styles.esquinaSuperiorDerecha
                        ]}
                    />

                    <View
                        style={[
                            styles.esquina,
                            styles.esquinaInferiorIzquierda
                        ]}
                    />

                    <View
                        style={[
                            styles.esquina,
                            styles.esquinaInferiorDerecha
                        ]}
                    />
                </View>
            </View>

            {mensaje !== "" && (
                <View
                    style={[
                        styles.resultado,
                        valido
                            ? styles.resultadoValido
                            : styles.resultadoInvalido
                    ]}
                >
                    <Text style={styles.resultadoTexto}>
                        {mensaje}
                    </Text>
                </View>
            )}

            {escaneado && (
                <Pressable
                    style={styles.boton}
                    onPress={escanearOtro}
                >
                    <Text style={styles.botonTexto}>
                        Escanear otro boleto
                    </Text>
                </Pressable>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.fondo,
        padding: 20
    },

    titulo: {
        color: colores.enfasis,
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10
    },

    descripcion: {
        color: colores.superficie,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20
    },

    permisoContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20
    },

    scannerContainer: {
        width: "100%",
        height: 430,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        backgroundColor: colores.negro
    },

    camera: {
        width: "100%",
        height: "100%"
    },

    marco: {
        position: "absolute",
        width: 240,
        height: 240,
        top: "50%",
        left: "50%",
        marginLeft: -120,
        marginTop: -120
    },

    esquina: {
        position: "absolute",
        width: 45,
        height: 45,
        borderColor: colores.enfasis
    },

    esquinaSuperiorIzquierda: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4
    },

    esquinaSuperiorDerecha: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4
    },

    esquinaInferiorIzquierda: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4
    },

    esquinaInferiorDerecha: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4
    },

    resultado: {
        marginTop: 20,
        padding: 18,
        borderRadius: 12,
        alignItems: "center"
    },

    resultadoValido: {
        backgroundColor: colores.verde
    },

    resultadoInvalido: {
        backgroundColor: colores.rojo
    },

    resultadoTexto: {
        color: colores.blanco,
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center"
    },

    boton: {
        backgroundColor: colores.enfasis,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
    },

    botonTexto: {
        color: colores.negro,
        fontSize: 16,
        fontWeight: "700"
    }
});