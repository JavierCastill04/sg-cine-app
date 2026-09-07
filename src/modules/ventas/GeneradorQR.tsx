import { useEffect, useRef } from "react";
import { BackHandler, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { commonStyles } from "../../theme";

interface Props {
    token: string;
    onGenerado: (qr: string) => void;
    onSalir: () => void;
}

interface QRCodeRef {
    toDataURL: (callback: (data: string) => void) => void;
}

export default function GeneradorQR({
    token,
    onGenerado,
    onSalir
}: Props) {
    const qrRef = useRef<QRCodeRef | null>(null);

    useEffect(() => {
        if (!token || !qrRef.current) {
            return;
        }

        qrRef.current.toDataURL(data => {
            const qr = `data:image/png;base64,${data}`;
            onGenerado(qr);
        });
    }, [token, onGenerado]);

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
            <Text style={commonStyles.title}>
                ¡Compra realizada!
            </Text>

            <Text style={commonStyles.text}>
                Tu boleto ha sido generado correctamente.
            </Text>

            <Text style={commonStyles.text}>
                Presenta este código QR en la entrada del cine.
            </Text>

            <View
                style={{
                    alignItems: "center",
                    marginVertical: 25,
                    padding: 20,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16
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
                style={[commonStyles.text, { textAlign: "center", marginBottom: 20 }]}>
                También enviamos tu boleto al correo electrónico
                proporcionado.
            </Text>

            <TouchableOpacity style={commonStyles.button} onPress={onSalir}>
                <Text style={commonStyles.buttonText}>
                    Salir
                </Text>
            </TouchableOpacity>
        </View>
    );
}