import { espaciado, colores } from "../../theme";
import { View } from "react-native";

export default function Separador() {
    return (
        <View style={{ height: 0.5, backgroundColor: colores.enfasis, marginLeft: -espaciado.xl, marginRight: -espaciado.xl }} />
    )
}