import type { ReactNode } from 'react';
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { commonStyles, colores } from '../../theme';

interface EstadoPantallaProps {
    cargando: boolean;
    error: string | null;
    datosCargados: boolean;
    onReintentar: () => void;
    children: ReactNode;
}

export default function EstadoPantalla({
    cargando,
    error,
    datosCargados,
    onReintentar,
    children,
}: EstadoPantallaProps) {
    if (cargando && !datosCargados) {
        return (
            <View style={commonStyles.containerScreen}>
                <ActivityIndicator
                    size="large"
                    color={colores.enfasis}
                />
                <Text style={commonStyles.dashboardEstado}>
                    Cargando información...
                </Text>
            </View>
        );
    }

    if (error && !datosCargados) {
        return (
            <View style={commonStyles.containerScreen}>
                <Text style={commonStyles.dashboardEstado}>
                    {error}
                </Text>

                <TouchableOpacity
                    style={[
                        commonStyles.button,
                        commonStyles.dashboardReintentar,
                    ]}
                    onPress={onReintentar}
                >
                    <Text style={commonStyles.buttonText}>
                        Reintentar
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return <>{children}</>;
}