import { Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import type { Venta } from "../../../types/Venta";
import type { Funcion } from "../../../types/Funcion";
import type { Pelicula } from "../../../types/Pelicula";
import type { Sala } from "../../../types/Sala";
import { commonStyles, colores } from "../../../theme";

interface Props {
    venta: Venta;
    pelicula: Pelicula;
    sala: Sala;
    funcion: Funcion;
}

export default function Boleto({ venta, pelicula, sala, funcion }: Props) {
    return (
        <View >
            <Text style={[commonStyles.subtitle, { marginTop: 0, color: colores.enfasis }]}>BOLETO DE CINE</Text>
            <Text style={[commonStyles.cardTitle, { marginTop: 10 }]}>{pelicula.nombre}</Text>
            <Text style={commonStyles.secondaryText}>{sala.nombre} </Text>
            <Text style={commonStyles.secondaryText}>{funcion.fecha} - {funcion.horaInicio}</Text>
            <View style={{ marginVertical: 15 }}>
                <View style={{ height: 1, backgroundColor: colores.enfasis }} />
            </View>
            <Text style={commonStyles.cardTitle}>Asientos</Text>
            <Text style={commonStyles.secondaryText}>{venta.asientos.join(", ")}</Text>
            <Text style={[commonStyles.cardTitle, { marginTop: 15 }]}>Cliente</Text>
            <Text style={commonStyles.secondaryText}>{venta.cliente.nombre}</Text>
            <Text style={commonStyles.secondaryText}>{venta.cliente.correo}</Text>
            <Text style={commonStyles.secondaryText}>{venta.cliente.telefono}</Text>
            <Text style={[commonStyles.cardTitle, { marginTop: 15 }]}>Total</Text>
            <Text style={commonStyles.secondaryText}>{venta.cantidadBoletos} boleto(s) — ${venta.total.toFixed(2)}</Text>

            <View
                style={{
                    alignSelf: "center",
                    marginVertical: 25,
                    padding: 15,
                    backgroundColor: colores.superficie,
                    borderWidth: 8,
                    borderColor: colores.negro,
                    borderRadius: 16
                }}
            >
                <QRCode
                    value={venta.token}
                    size={220}
                />
            </View>

            <Text style={[commonStyles.secondaryText, { textAlign: "center" }]}>
                Presenta este código QR en la entrada del cine.
            </Text>
        </View>
    );
}