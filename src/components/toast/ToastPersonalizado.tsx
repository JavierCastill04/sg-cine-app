
import { Text, View } from 'react-native';
import {
    CheckCircle2,
    CircleAlert,
    Info,
} from 'lucide-react-native';
import type { ToastConfig } from 'react-native-toast-message';

import { colores, commonStyles } from '../../theme';

export const toastConfig: ToastConfig = {
    success: ({ text1, text2 }) => (
        <View
            style={[
                commonStyles.toastContainer,
                commonStyles.toastExito,
            ]}
        >
            <CheckCircle2
                size={24}
                color={colores.verde}
            />

            <View style={commonStyles.toastContenido}>
                {text1 ? (
                    <Text style={commonStyles.toastTitulo}>
                        {text1}
                    </Text>
                ) : null}

                {text2 ? (
                    <Text style={commonStyles.toastDescripcion}>
                        {text2}
                    </Text>
                ) : null}
            </View>
        </View>
    ),

    error: ({ text1, text2 }) => (
        <View
            style={[
                commonStyles.toastContainer,
                commonStyles.toastError,
            ]}
        >
            <CircleAlert
                size={24}
                color={colores.rojo}
            />

            <View style={commonStyles.toastContenido}>
                {text1 ? (
                    <Text style={commonStyles.toastTitulo}>
                        {text1}
                    </Text>
                ) : null}

                {text2 ? (
                    <Text style={commonStyles.toastDescripcion}>
                        {text2}
                    </Text>
                ) : null}
            </View>
        </View>
    ),

    info: ({ text1, text2 }) => (
        <View
            style={[
                commonStyles.toastContainer,
                commonStyles.toastInfo,
            ]}
        >
            <Info
                size={24}
                color={colores.enfasis}
            />

            <View style={commonStyles.toastContenido}>
                {text1 ? (
                    <Text style={commonStyles.toastTitulo}>
                        {text1}
                    </Text>
                ) : null}

                {text2 ? (
                    <Text style={commonStyles.toastDescripcion}>
                        {text2}
                    </Text>
                ) : null}
            </View>
        </View>
    ),
};
