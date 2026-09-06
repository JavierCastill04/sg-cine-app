import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, ScrollView } from 'react-native';

import { useAppSelector } from '../../../redux/hooks';
import { commonStyles, colores } from '../../../theme';

export default function DashboardScreen() {
    const peliculas = useAppSelector((state) => state.pelicula);
    const funciones = useAppSelector((state) => state.funcion);
    const salas = useAppSelector((state) => state.sala);
    const ventas = useAppSelector((state) => state.venta);

    // 1. Cantidad de películas
    const cantidadPeliculas = peliculas.length;

    // 2. Cantidad de funciones
    const cantidadFunciones = funciones.length;

    // 3. Boletos vendidos
    const boletosVendidos = ventas.reduce(
        (total, venta) => total + venta.cantidadBoletos,
        0
    );

    // 4. Asientos disponibles
    const asientosDisponibles = funciones.reduce(
        (total, funcion) =>
            total +
            funcion.estadoAsientos.filter(
                asiento => asiento.estado === 'disponible'
            ).length,
        0
    );

    // 5. Asientos ocupados
    const asientosOcupados = funciones.reduce(
        (total, funcion) =>
            total +
            funcion.estadoAsientos.filter(
                asiento =>
                    asiento.estado === 'reservado' ||
                    asiento.estado === 'seleccionado'
            ).length,
        0
    );

    // 6. Ingresos
    const ingresos = ventas.reduce(
        (total, venta) => total + venta.total,
        0
    );

    // 7. Película más reservada
    const reservasPorPelicula: {
        [peliculaId: number]: number;
    } = {};

    ventas.forEach(venta => {
        const funcion = funciones.find(
            funcion => funcion.id === venta.funcionId
        );

        if (funcion) {
            reservasPorPelicula[funcion.peliculaId] =
                (reservasPorPelicula[funcion.peliculaId] || 0) +
                venta.cantidadBoletos;
        }
    });

    let peliculaMasReservada = 'Ninguna';
    let mayorCantidadReservas = 0;

    Object.entries(reservasPorPelicula).forEach(
        ([peliculaId, cantidad]) => {
            if (cantidad > mayorCantidadReservas) {
                const pelicula = peliculas.find(
                    pelicula => pelicula.id === Number(peliculaId)
                );

                if (pelicula) {
                    peliculaMasReservada = pelicula.nombre;
                    mayorCantidadReservas = cantidad;
                }
            }
        }
    );

    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <Text style={commonStyles.title}>
                    Dashboard
                </Text>

                <Text style={commonStyles.subtitle}>
                    Resumen general del cine
                </Text>

                {/* Películas */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Películas
                    </Text>

                    <Text style={styles.valor}>
                        {cantidadPeliculas}
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

                    <Text style={styles.valor}>
                        {cantidadFunciones}
                    </Text>

                    <Text style={commonStyles.text}>
                        Funciones programadas
                    </Text>
                </View>

                {/* Boletos */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Boletos vendidos
                    </Text>

                    <Text style={styles.valor}>
                        {boletosVendidos}
                    </Text>

                    <Text style={commonStyles.text}>
                        Boletos vendidos
                    </Text>
                </View>

                {/* Asientos */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Asientos
                    </Text>

                    <Text style={styles.valor}>
                        {asientosDisponibles}
                    </Text>

                    <Text style={commonStyles.text}>
                        Asientos disponibles
                    </Text>

                    <Text style={[styles.valor, { marginTop: 12 }]}>
                        {asientosOcupados}
                    </Text>

                    <Text style={commonStyles.text}>
                        Asientos ocupados
                    </Text>
                </View>

                {/* Ingresos */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Ingresos
                    </Text>

                    <Text style={styles.valor}>
                        ${ingresos.toFixed(2)}
                    </Text>

                    <Text style={commonStyles.text}>
                        Ingresos por ventas
                    </Text>
                </View>

                {/* Película más reservada */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Película más reservada
                    </Text>

                    <Text style={styles.pelicula}>
                        {peliculaMasReservada}
                    </Text>

                    {mayorCantidadReservas > 0 && (
                        <Text style={commonStyles.text}>
                            {mayorCantidadReservas} boletos vendidos
                        </Text>
                    )}
                </View>

                {/* Información adicional */}
                <View style={commonStyles.card}>
                    <Text style={commonStyles.cardTitle}>
                        Salas
                    </Text>

                    <Text style={styles.valor}>
                        {salas.length}
                    </Text>

                    <Text style={commonStyles.text}>
                        Salas registradas
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = {
    valor: {
        fontSize: 32,
        fontWeight: '700' as const,
        color: colores.enfasis,
        marginBottom: 4,
    },

    pelicula: {
        fontSize: 22,
        fontWeight: '700' as const,
        color: colores.superficie,
        marginBottom: 8,
    },
};