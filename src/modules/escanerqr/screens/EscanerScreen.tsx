
import { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
    CheckCircle2,
    XCircle,
    Info,
} from "lucide-react-native";

import { reservasService } from "../../../services/reservas.service";
import { colores } from "../../../theme";
import styles from "../../../theme/scanerStyles";

export default function EscanerScreen() {
    const [permission, requestPermission] = useCameraPermissions();

    const [escaneado, setEscaneado] = useState(false);
    const [validando, setValidando] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [valido, setValido] = useState<boolean | null>(null);

    const procesandoRef = useRef(false);
    const sesionRef = useRef(0);

    const reiniciarEscaner = useCallback(() => {
        procesandoRef.current = false;
        setEscaneado(false);
        setValidando(false);
        setMensaje("");
        setValido(null);
    }, []);

    useFocusEffect(
        useCallback(() => {
            reiniciarEscaner();

            return () => {
                // Invalida las respuestas pendientes al salir.
                sesionRef.current += 1;
                procesandoRef.current = true;
                setEscaneado(true);
            };
        }, [reiniciarEscaner])
    );

    const manejarEscaneo = async ({ data }: { data: string }) => {
        if (procesandoRef.current) {
            return;
        }

        procesandoRef.current = true;
        setEscaneado(true);

        const sesionActual = sesionRef.current;
        const codigo = data.trim();

        if (!codigo) {
            setValido(false);
            setMensaje("El código QR está vacío.");
            return;
        }

        setValidando(true);
        setMensaje("Consultando el servidor...");
        setValido(null);

        try {
            const respuesta = await reservasService.validar(codigo);

            if (sesionActual !== sesionRef.current) {
                return;
            }

            if (respuesta.estado === "utilizada") {
                setValido(true);
                setMensaje("Acceso autorizado.");
            } else {
                setValido(false);
                setMensaje(
                    "El servidor no confirmó la validación del boleto."
                );
            }
        } catch (error) {
            if (sesionActual !== sesionRef.current) {
                return;
            }

            setValido(false);
            setMensaje(
                error instanceof Error
                    ? error.message
                    : "No se pudo validar el boleto."
            );
        } finally {
            if (sesionActual === sesionRef.current) {
                setValidando(false);
            }
        }
    };

    const escanearOtro = () => {
        if (validando) {
            return;
        }

        reiniciarEscaner();
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
            <ScrollView
                contentContainerStyle={styles.contenido}
                keyboardShouldPersistTaps="handled"
            >
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
                        active={!escaneado}
                        barcodeScannerSettings={{
                            barcodeTypes: ["qr"],
                        }}
                        onBarcodeScanned={
                            escaneado ? undefined : manejarEscaneo
                        }
                        onMountError={error => {
                            console.log(
                                "Error al iniciar cámara:",
                                error.message
                            );

                            setMensaje(
                                `Error de cámara: ${error.message}`
                            );
                            setValido(false);
                        }}
                    />

                    <View
                        style={styles.marco}
                        pointerEvents="none"
                    >
                        <View
                            style={[
                                styles.esquina,
                                styles.esquinaSuperiorIzquierda,
                            ]}
                        />
                        <View
                            style={[
                                styles.esquina,
                                styles.esquinaSuperiorDerecha,
                            ]}
                        />
                        <View
                            style={[
                                styles.esquina,
                                styles.esquinaInferiorIzquierda,
                            ]}
                        />
                        <View
                            style={[
                                styles.esquina,
                                styles.esquinaInferiorDerecha,
                            ]}
                        />
                    </View>
                </View>

                {validando && (
                    <ActivityIndicator
                        size="large"
                        color={colores.enfasis}
                    />
                )}

                {mensaje !== "" && (
                    <View
                        style={[
                            styles.resultado,
                            valido === true
                                ? styles.resultadoValido
                                : valido === false
                                    ? styles.resultadoInvalido
                                    : styles.resultadoInfo,
                        ]}
                    >
                        <View style={styles.resultadoIcono}>
                            {valido === true ? (
                                <CheckCircle2
                                    size={26}
                                    color="#5EE0A0"
                                />
                            ) : valido === false ? (
                                <XCircle
                                    size={26}
                                    color="#FF8B8B"
                                />
                            ) : (
                                <Info
                                    size={26}
                                    color={colores.enfasis}
                                />
                            )}
                        </View>

                        <View style={styles.resultadoContenido}>
                            <Text style={styles.resultadoTitulo}>
                                {valido === true
                                    ? "Boleto válido"
                                    : valido === false
                                        ? "Boleto rechazado"
                                        : "Validando boleto"}
                            </Text>

                            <Text style={styles.resultadoTexto}>
                                {mensaje}
                            </Text>
                        </View>
                    </View>
                )}

                {escaneado && !validando && (
                    <Pressable
                        style={styles.boton}
                        onPress={escanearOtro}
                    >
                        <Text style={styles.botonTexto}>
                            Escanear otro boleto
                        </Text>
                    </Pressable>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
