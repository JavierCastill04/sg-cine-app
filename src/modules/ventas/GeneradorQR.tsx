
import { useEffect, useRef } from "react";
import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { colores, commonStyles } from "../../theme";

interface Props {
    token: string;
    onGenerado: (qr: string) => void;
    onEnviar: () => void;
    onSalir: () => void;
}

interface QRCodeRef {
    toDataURL: (callback: (data: string) => void) => void;
}

export default function GeneradorQR({
    token,
    onGenerado,
    onEnviar,
    onSalir,
}: Props) {
    const qrRef = useRef<QRCodeRef | null>(null);
    const onGeneradoRef = useRef(onGenerado);
    const generadoRef = useRef("");

    useEffect(() => {
        onGeneradoRef.current = onGenerado;
    }, [onGenerado]);

    useEffect(() => {
        if (!token || !qrRef.current || generadoRef.current === token) {
            return;
        }

        const tokenActual = token;

        qrRef.current.toDataURL(data => {
            if (generadoRef.current === tokenActual) {
                return;
            }

            generadoRef.current = tokenActual;

            onGeneradoRef.current(
                `data:image/png;base64,${data}`
            );
        });
    }, [token]);

    useEffect(() => {
        const manejarAtras = () => {
            onSalir();
            return true;
        };

        const suscripcion = BackHandler.addEventListener(
            "hardwareBackPress",
            manejarAtras
        );

        return () => suscripcion.remove();
    }, [onSalir]);

    return (
        <View style={commonStyles.containerScreen}>
            <Text
                style={[
                    commonStyles.subtitle,
                    { color: colores.enfasis },
                ]}
            >
                ¡Reserva realizada!
            </Text>

            <Text style={commonStyles.text}>
                Tu boleto ha sido generado correctamente.
            </Text>

            <Text style={commonStyles.text}>
                Presenta este código QR en la entrada del cine.
            </Text>

            <View
                style={{
                    alignSelf: "center",
                    marginVertical: 25,
                    padding: 15,
                    backgroundColor: colores.superficie,
                    borderWidth: 8,
                    borderColor: colores.negro,
                    borderRadius: 16,
                }}
            >
                <QRCode
                    value={token}
                    size={250}
                    getRef={ref => {
                        qrRef.current = ref as QRCodeRef;
                    }}
                />
            </View>

            <Text
                style={[
                    commonStyles.text,
                    {
                        textAlign: "center",
                        marginBottom: 20,
                    },
                ]}
            >
                Puedes enviar el boleto al correo de tu cuenta.
            </Text>

            <TouchableOpacity
                style={commonStyles.button}
                onPress={onEnviar}
            >
                <Text style={commonStyles.buttonText}>
                    Enviar boleto al correo
                </Text>
            </TouchableOpacity>

            <View style={{ marginVertical: 10 }} />

            <TouchableOpacity
                style={commonStyles.button}
                onPress={onSalir}
            >
                <Text style={commonStyles.buttonText}>
                    Salir
                </Text>
            </TouchableOpacity>
        </View>
    );
}