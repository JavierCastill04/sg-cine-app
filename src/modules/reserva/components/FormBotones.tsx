import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { commonStyles } from "../../../theme";

interface Props {
    paso: number;
    puedeContinuar: boolean;
    onVolver: () => void;
    onContinuar: () => void;
    onConfirmar: () => void;
    confirmando: boolean;
}

export default function FormBotones({
    paso,
    puedeContinuar,
    onVolver,
    onContinuar,
    onConfirmar,
    confirmando
}: Props) {
    return (
        <>
            <View style={styles.buttons}>
                <TouchableOpacity style={[commonStyles.button, styles.button]} onPress={onVolver}>
                    <Text style={commonStyles.buttonText}>Atrás</Text>
                </TouchableOpacity>

                {paso < 4 && (
                    <TouchableOpacity
                        style={[
                            commonStyles.button,
                            styles.button,
                            !puedeContinuar && styles.deshabilitado
                        ]}
                        onPress={onContinuar}
                        disabled={!puedeContinuar}
                    >
                        <Text style={commonStyles.buttonText}>Continuar</Text>
                    </TouchableOpacity>
                )}

                {paso === 4 && (
                    <TouchableOpacity style={[commonStyles.button, styles.button]} onPress={onConfirmar} disabled={confirmando}>
                        <Text style={commonStyles.buttonText}>{confirmando ? "Procesando..." : "Confirmar compra"}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    buttons: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20
    },

    button: {
        flex: 1
    },

    deshabilitado: {
        opacity: 0.5
    }
});