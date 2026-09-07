import { StyleSheet } from "react-native";
import { colores } from "./colores";

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

export default styles;