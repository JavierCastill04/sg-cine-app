
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { commonStyles, colores } from '../../../theme';
import { dashboardService } from '../../../services/dashboard.service';
import type { DashboardResponse } from '../../../services/dashboard.service';

export default function DashboardScreen() {
    const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarDashboard = useCallback(async (mostrarCarga = true) => {
        if (mostrarCarga) {
            setCargando(true);
        }

        setError(null);

        try {
            const respuesta = await dashboardService.obtenerDashboard();
            setDashboard(respuesta);
        } catch (err) {
            setDashboard(null);

            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudieron cargar las estadísticas.'
            );
        } finally {
            setCargando(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            let activo = true;

            const cargar = async () => {
                setCargando(true);
                setError(null);

                try {
                    const respuesta = await dashboardService.obtenerDashboard();

                    if (activo) {
                        setDashboard(respuesta);
                    }
                } catch (err) {
                    if (activo) {
                        setDashboard(null);
                        setError(
                            err instanceof Error
                                ? err.message
                                : 'No se pudieron cargar las estadísticas.'
                        );
                    }
                } finally {
                    if (activo) {
                        setCargando(false);
                    }
                }
            };

            cargar();

            return () => {
                activo = false;
            };
        }, [])
    );

    const actualizarDashboard = async () => {
        setActualizando(true);

        try {
            await cargarDashboard(false);
        } finally {
            setActualizando(false);
        }
    };

    if (cargando && !dashboard) {
        return (
            <View style={commonStyles.containerScreen}>
                <Text style={commonStyles.subtitle}>
                    Resumen general del cine
                </Text>

                <ActivityIndicator
                    size="large"
                    color={colores.enfasis}
                />

                <Text style={commonStyles.dashboardEstado}>
                    Cargando estadísticas...
                </Text>
            </View>
        );
    }

    if (error && !dashboard) {
        return (
            <View style={commonStyles.containerScreen}>
                <Text style={commonStyles.subtitle}>
                    Resumen general del cine
                </Text>

                <Text style={commonStyles.dashboardEstado}>
                    {error}
                </Text>

                <TouchableOpacity
                    style={[
                        commonStyles.button,
                        commonStyles.dashboardReintentar,
                    ]}
                    onPress={() => cargarDashboard()}
                >
                    <Text style={commonStyles.buttonText}>
                        Reintentar
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!dashboard) {
        return null;
    }

    const {
        peliculas,
        funciones,
        boletosVendidos,
        asientos,
        ingresosTotales,
        ingresosPorCine,
        peliculaMasReservada,
    } = dashboard;

    return (
        <View style={commonStyles.containerScreen}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={actualizando}
                        onRefresh={actualizarDashboard}
                        tintColor={colores.enfasis}
                        colors={[colores.enfasis]}
                    />
                }
            >
                <Text style={commonStyles.subtitle}>
                    Resumen general del cine
                </Text>

                {/* Películas */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Películas
                    </Text>

                    <Text style={commonStyles.dashboardValor}>
                        {peliculas.total}
                    </Text>

                    <Text style={commonStyles.text}>
                        Películas registradas
                    </Text>
                </View>

                {/* Funciones */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Funciones
                    </Text>

                    <Text style={commonStyles.dashboardValor}>
                        {funciones.total}
                    </Text>

                    <Text style={commonStyles.text}>
                        Funciones programadas
                    </Text>

                    <Text
                        style={[
                            commonStyles.text,
                            commonStyles.dashboardSeparacion,
                        ]}
                    >
                        Activas: {funciones.activas}
                    </Text>

                    <Text style={commonStyles.text}>
                        Canceladas: {funciones.canceladas}
                    </Text>
                </View>

                {/* Boletos */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Boletos vendidos
                    </Text>

                    <Text style={commonStyles.dashboardValor}>
                        {boletosVendidos}
                    </Text>

                    <Text style={commonStyles.text}>
                        Total de boletos vendidos
                    </Text>
                </View>

                {/* Asientos */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Asientos
                    </Text>

                    <Text style={commonStyles.dashboardValor}>
                        {asientos.disponibles}
                    </Text>

                    <Text style={commonStyles.text}>
                        Asientos disponibles
                    </Text>

                    <Text
                        style={[
                            commonStyles.dashboardValor,
                            commonStyles.dashboardSeparacion,
                        ]}
                    >
                        {asientos.ocupados}
                    </Text>

                    <Text style={commonStyles.text}>
                        Asientos ocupados
                    </Text>

                    <Text
                        style={[
                            commonStyles.text,
                            commonStyles.dashboardSeparacion,
                        ]}
                    >
                        Capacidad total: {asientos.capacidadTotal}
                    </Text>
                </View>

                {/* Ingresos totales */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Ingresos
                    </Text>

                    <Text style={commonStyles.dashboardValor}>
                        ${ingresosTotales.toFixed(2)}
                    </Text>

                    <Text style={commonStyles.text}>
                        Ingresos totales por ventas
                    </Text>
                </View>

                {/* Película más reservada */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Película más reservada
                    </Text>

                    <Text style={commonStyles.dashboardPelicula}>
                        {peliculaMasReservada?.pelicula ?? 'Ninguna'}
                    </Text>

                    {peliculaMasReservada && (
                        <Text style={commonStyles.text}>
                            {peliculaMasReservada.boletosVendidos} boletos vendidos
                        </Text>
                    )}
                </View>

                {/* Ingresos por cine */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Ingresos por cine
                    </Text>

                    {ingresosPorCine.length === 0 ? (
                        <Text style={commonStyles.text}>
                            No hay ingresos registrados.
                        </Text>
                    ) : (
                        ingresosPorCine.map((cine) => (
                            <View
                                key={cine.cineId}
                                style={commonStyles.dashboardCineFila}
                            >
                                <Text style={commonStyles.dashboardCineNombre}>
                                    {cine.cine}
                                </Text>

                                <Text style={commonStyles.dashboardCineIngreso}>
                                    ${cine.ingresos.toFixed(2)}
                                </Text>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
