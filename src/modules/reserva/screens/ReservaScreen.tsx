import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, BackHandler, ScrollView, Text, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { cargarAsientosFuncion, cargarFuncionPorId, } from "../../../redux/thunks/funcionThunks";
import { crearReservaThunk } from "../../../redux/thunks/reservasThunks";
import { cargarPeliculas } from "../../../redux/thunks/peliculaThunks";
import { cargarSalas } from "../../../redux/thunks/salaThunks";
import type { RootStackParamList } from "../../../navigation/types";
import { commonStyles, colores } from "../../../theme";
import type { Venta } from "../../../types/Venta";
import {
    BarraProgreso,
    FormBotones,
    PasoAsientos,
    PasoConfirmacion,
    PasoContainer,
    PasoFuncion,
} from "../components";
import GeneradorQR from "../../ventas/GeneradorQR";
import { generarBoleto } from "../../ventas/generarBoleto";
import { enviarBoleto } from "../../ventas/enviarBoleto";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const pasos = ["Función", "Asientos", "Confirmar", "Boleto"];

const convertirAsientoApi = (asientoId: string): string => {
    const coincidencia = asientoId.match(/^\d+-([A-Z]+)-(\d+)$/);

    if (!coincidencia) {
        throw new Error(`Identificador de asiento inválido: ${asientoId} `);
    }

    return `${coincidencia[1]}${coincidencia[2]} `;
};

export default function ReservaScreen({ route }: any) {
    const navigation = useNavigation<NavigationProp>();
    const { funcionId, pasoInicial } = route.params;

    const dispatch = useAppDispatch();

    const [paso, setPaso] = useState(pasoInicial === 2 ? 2 : 1);
    const [comprando, setComprando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [cargandoAsientos, setCargandoAsientos] = useState(false);
    const [errorCarga, setErrorCarga] = useState<string | null>(null);
    const [venta, setVenta] = useState<Venta | null>(null);
    const [pdfUri, setPdfUri] = useState<string | null>(null);
    const [seleccionados, setSeleccionados] = useState<string[]>([]);

    const funcion = useAppSelector(
        state => state.funcion.find(f => f.id === funcionId)
    );

    const pelicula = useAppSelector(
        state =>
            state.pelicula.lista.find(
                p => p.id === funcion?.peliculaId
            )
    );

    const sala = useAppSelector(
        state => state.sala.find(s => s.id === funcion?.salaId)
    );

    const usuario = useAppSelector(state => state.auth.usuario);

    useEffect(() => {
        let vigente = true;

        const cargarDatos = async () => {
            setCargandoDatos(true);
            setErrorCarga(null);

            try {
                const resultados = await Promise.all([
                    dispatch(cargarFuncionPorId(funcionId)).unwrap(),
                    dispatch(cargarPeliculas()).unwrap(),
                    dispatch(cargarSalas()).unwrap(),
                ]);

                if (!vigente) {
                    return;
                }

                const funcionCargada = resultados[0];

                if (funcionCargada.estado === "cancelada") {
                    setErrorCarga("Esta función ha sido cancelada.");
                }
            } catch (error) {
                if (vigente) {
                    setErrorCarga(
                        typeof error === "string"
                            ? error
                            : error instanceof Error
                                ? error.message
                                : "No se pudieron cargar los datos de la función."
                    );
                }
            } finally {
                if (vigente) {
                    setCargandoDatos(false);
                }
            }
        };

        void cargarDatos();

        return () => {
            vigente = false;
        };
    }, [dispatch, funcionId]);

    useEffect(() => {
        if (paso !== 2 || !funcion || !sala) {
            return;
        }

        let vigente = true;

        const cargarAsientos = async () => {
            setCargandoAsientos(true);

            try {
                await dispatch(
                    cargarAsientosFuncion({
                        funcionId: funcion.id,
                        salaId: sala.id,
                    })
                ).unwrap();
            } catch (error) {
                if (vigente) {
                    Alert.alert(
                        "Error",
                        typeof error === "string"
                            ? error
                            : "No se pudieron cargar los asientos disponibles."
                    );
                }
            } finally {
                if (vigente) {
                    setCargandoAsientos(false);
                }
            }
        };

        void cargarAsientos();

        return () => {
            vigente = false;
        };
    }, [paso, funcion?.id, sala?.id, dispatch]);

    useEffect(() => {
        const manejarAtras = () => {
            if (paso > 1 && paso < 4) {
                setPaso(actual => actual - 1);
                return true;
            }

            navigation.pop();
            return true;
        };

        const suscripcion = BackHandler.addEventListener(
            "hardwareBackPress",
            manejarAtras
        );

        return () => suscripcion.remove();
    }, [paso, navigation]);

    if (cargandoDatos) {
        return (
            <SafeAreaView style={commonStyles.containerScreen}>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ActivityIndicator
                        size="large"
                        color={colores.enfasis}
                    />
                    <Text style={commonStyles.text}>
                        Cargando datos de la función...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    if (errorCarga || !funcion || !pelicula || !sala) {
        return (
            <SafeAreaView style={commonStyles.containerScreen}>
                <View style={{ padding: 20 }}>
                    <Text style={commonStyles.text}>
                        {errorCarga ?? "No se encontró la función, la película o la sala."}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const total = pelicula.precio * seleccionados.length;

    const seleccionarAsiento = (id: string) => {
        setSeleccionados(actual =>
            actual.includes(id)
                ? actual.filter(asiento => asiento !== id)
                : [...actual, id]
        );
    };

    const puedeContinuar = () => {
        if (paso === 2) {
            return seleccionados.length > 0 && !cargandoAsientos;
        }

        return paso < 3;
    };

    const continuar = () => {
        if (puedeContinuar()) {
            setPaso(actual => actual + 1);
        }
    };

    const volver = () => {
        if (paso === 1) {
            navigation.pop();
            return;
        }

        setPaso(actual => actual - 1);
    };

    const confirmarCompra = async () => {
        if (comprando) {
            return;
        }

        if (!usuario || usuario.rol !== "cliente") {
            Alert.alert(
                "Sesión no válida",
                "Debes iniciar sesión como cliente para reservar."
            );
            return;
        }

        if (seleccionados.length === 0) {
            Alert.alert(
                "Selecciona asientos",
                "Debes seleccionar al menos un asiento."
            );
            return;
        }

        setComprando(true);

        try {
            const asientosApi = seleccionados.map(convertirAsientoApi);

            const reserva = await dispatch(
                crearReservaThunk({
                    funcionId: funcion.id,
                    asientos: asientosApi,
                })
            ).unwrap();

            const fechaFin = new Date(
                `${funcion.fecha}T${funcion.horaInicio} `
            );

            fechaFin.setMinutes(
                fechaFin.getMinutes() + pelicula.duracion
            );

            const nuevaVenta: Venta = {
                id: reserva.id,
                funcionId: reserva.funcionId,
                usuario,
                asientos: reserva.asientos,
                cantidadBoletos: reserva.asientos.length,
                total: Number(reserva.total),
                fechaVenta: new Date().toISOString(),
                token: reserva.codigo,
                tokenExpira: fechaFin.toISOString(),
                tokenUsado: reserva.estado === "utilizada",
            };

            setVenta(nuevaVenta);
            setPdfUri(null);
            setPaso(4);
        } catch (error) {
            const mensaje =
                typeof error === "string"
                    ? error
                    : error instanceof Error
                        ? error.message
                        : "No se pudo crear la reserva.";

            Alert.alert("No se pudo completar la reserva", mensaje);
        } finally {
            setComprando(false);
        }
    };

    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <ScrollView>
                <Text style={commonStyles.title}>
                    Reserva de boletos
                </Text>

                <BarraProgreso paso={paso} pasos={pasos} />

                <PasoContainer paso={paso}>
                    {paso === 1 && (
                        <PasoFuncion
                            pelicula={pelicula}
                            sala={sala}
                            funcion={funcion}
                        />
                    )}

                    {paso === 2 && (
                        <>
                            {cargandoAsientos && (
                                <Text style={commonStyles.text}>
                                    Cargando disponibilidad de asientos...
                                </Text>
                            )}

                            <PasoAsientos
                                sala={sala}
                                funcion={funcion}
                                seleccionados={seleccionados}
                                total={total}
                                onSeleccionar={seleccionarAsiento}
                            />
                        </>
                    )}

                    {paso === 3 && usuario && (
                        <PasoConfirmacion
                            pelicula={pelicula}
                            sala={sala}
                            funcion={funcion}
                            seleccionados={seleccionados}
                            usuario={usuario}
                            total={total}
                        />
                    )}

                    {paso === 4 && venta && (
                        <GeneradorQR
                            token={venta.token}
                            onGenerado={async qr => {
                                try {
                                    const uri = await generarBoleto({
                                        venta,
                                        pelicula,
                                        sala,
                                        funcion,
                                        qr,
                                    });

                                    setPdfUri(uri);
                                } catch {
                                    Alert.alert(
                                        "Error",
                                        "No se pudo generar el boleto."
                                    );
                                }
                            }}
                            onEnviar={async () => {
                                if (!pdfUri) {
                                    Alert.alert(
                                        "Error",
                                        "El boleto todavía no está listo."
                                    );
                                    return;
                                }

                                try {
                                    await enviarBoleto(venta, pdfUri);

                                    Alert.alert(
                                        "Boleto enviado",
                                        `El boleto fue enviado a ${venta.usuario.correo}.`
                                    );
                                } catch (error) {
                                    Alert.alert(
                                        "Error",
                                        error instanceof Error
                                            ? error.message
                                            : "No se pudo enviar el boleto."
                                    );
                                }
                            }}
                            onSalir={() => navigation.pop()}
                        />
                    )}
                </PasoContainer>

                {paso < 4 && (
                    <FormBotones
                        paso={paso === 3 ? 4 : paso}
                        puedeContinuar={puedeContinuar()}
                        onVolver={volver}
                        onContinuar={continuar}
                        onConfirmar={confirmarCompra}
                        confirmando={comprando}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
}