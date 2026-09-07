import { StyleSheet } from "react-native";
import { commonStyles, colores, espaciado } from "../../theme";

export const styles = StyleSheet.create({
    pantalla: {
        height: 42,
        backgroundColor: colores.primario,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: espaciado.lg
    },
    mapa: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: espaciado.md
    },
    seccion: {
        width: "48%",
        minHeight: 135,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: espaciado.md
    },
    volver: {
        paddingStart: 15,
        paddingEnd: 15,
        backgroundColor: colores.enfasis,
        borderRadius: 25,
        alignItems: "center",
    },
    tituloSeccion: {
        ...commonStyles.heading,
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        color: colores.enfasis,
    },
    espacioHeader: {
        width: 65
    },
    mapaAsientos: {
        height: 360,
        borderColor: colores.enfasis,
        borderWidth: 2,
        borderRadius: 10,
        backgroundColor: colores.secundario,
        overflow: "hidden"
    },
    grid: {
        padding: espaciado.md,
        alignSelf: "center"
    },
    asiento: {
        width: 70,
        height: 70,
        margin: 6,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    reservado: {
        opacity: 0.45
    },
    seleccionado: {
        borderWidth: 1,
        borderColor: colores.enfasis
    },
    leyenda: {
        flexDirection: "row",
        justifyContent: "center",
        gap: espaciado.lg,
        marginTop: espaciado.md
    },
    estado: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    seleccionados: {
        color: colores.superficie,
        textAlign: "center" as const
    },
});