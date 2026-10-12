
import { StyleSheet } from "react-native";
import { colores } from "./colores";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colores.fondo,
    },

    contenido: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 36,
    },

    titulo: {
        color: colores.enfasis,
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
    },

    descripcion: {
        color: colores.superficie,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 20,
    },

    permisoContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },

    scannerContainer: {
        width: "100%",
        height: 360,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
        backgroundColor: colores.negro,
    },

    camera: {
        width: "100%",
        height: "100%",
    },

    marco: {
        position: "absolute",
        width: 220,
        height: 220,
        top: "50%",
        left: "50%",
        marginLeft: -110,
        marginTop: -110,
    },

    esquina: {
        position: "absolute",
        width: 45,
        height: 45,
        borderColor: colores.enfasis,
    },

    esquinaSuperiorIzquierda: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },

    esquinaSuperiorDerecha: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },

    esquinaInferiorIzquierda: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },

    esquinaInferiorDerecha: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },

    resultado: {
        marginTop: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
    },

    resultadoValido: {
        backgroundColor: "#153B2A",
        borderColor: "#26734B",
    },

    resultadoInvalido: {
        backgroundColor: "#442020",
        borderColor: "#9D3838",
    },

    resultadoInfo: {
        backgroundColor: "#262626",
        borderColor: "#555555",
    },

    resultadoIcono: {
        marginRight: 12,
    },

    resultadoContenido: {
        flex: 1,
    },

    resultadoTitulo: {
        color: colores.blanco,
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 3,
    },

    resultadoTexto: {
        color: colores.blanco,
        fontSize: 14,
        lineHeight: 20,
    },

    boton: {
        backgroundColor: colores.enfasis,
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
    },

    botonTexto: {
        color: colores.negro,
        fontSize: 16,
        fontWeight: "700",
    },
});

export default styles;
