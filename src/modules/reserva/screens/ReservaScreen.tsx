import { useState, useEffect } from "react";
import { ScrollView, Text, View, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppSelector } from "../../../redux/hooks";
import type { RootStackParamList } from "../../../navigation/types";
import { commonStyles } from "../../../theme";
import BarraProgreso from "../components/BarraProgreso";
import PasoContainer from "../components/PasoContainer";
import FormBotones from "../components/FormBotones";
import PasoFuncion from "../components/PasoFuncion";
import PasoAsientos from "../components/PasoAsientos";
import PasoCliente from "../components/PasoCliente";
import PasoConfirmacion from "../components/PasoConfirmacion";
import { SafeAreaView } from "react-native-safe-area-context";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Cliente {
    nombre: string;
    correo: string;
    telefono: string;
}

const pasos = [
    "Función",
    "Asientos",
    "Datos",
    "Confirmar"
];

export default function ReservaScreen({ route }: any) {
    const navigation = useNavigation<NavigationProp>();
    const { funcionId } = route.params;
    const [paso, setPaso] = useState(1);
    const [seleccionados, setSeleccionados] = useState<string[]>([]);
    const [cliente, setCliente] = useState<Cliente>({ nombre: "", correo: "", telefono: "" });
    const funcion = useAppSelector(state => state.funcion.find(f => f.id === funcionId));
    const pelicula = useAppSelector(state => state.pelicula.find(p => p.id === funcion?.peliculaId));
    const sala = useAppSelector(state => state.sala.find(s => s.id === funcion?.salaId));

    if (!funcion || !pelicula || !sala) {
        return (
            <View style={commonStyles.containerScreen}>
                <Text style={commonStyles.text}>
                    No se encontró la función.
                </Text>
            </View>
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

    const actualizarCliente = (
        campo: keyof Cliente,
        valor: string
    ) => {
        setCliente(actual => ({
            ...actual,
            [campo]: valor
        }));
    };

    const puedeContinuar = () => {
        if (paso === 2) {
            return seleccionados.length > 0;
        }

        if (paso === 3) {
            return (
                cliente.nombre.trim() !== "" &&
                cliente.correo.trim() !== "" &&
                cliente.telefono.trim() !== ""
            );
        }

        return paso < 4;
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

    const confirmarCompra = () => {
    };

    useEffect(() => {
        const manejarAtras = () => {
            if (paso > 1) {
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

    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <ScrollView>
                <Text style={commonStyles.title}>Reserva de boletos</Text>
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
                        <PasoAsientos
                            sala={sala}
                            funcion={funcion}
                            seleccionados={seleccionados}
                            total={total}
                            onSeleccionar={seleccionarAsiento}
                        />
                    )}

                    {paso === 3 && (
                        <PasoCliente
                            cliente={cliente}
                            onChange={actualizarCliente}
                        />
                    )}

                    {paso === 4 && (
                        <PasoConfirmacion
                            pelicula={pelicula}
                            sala={sala}
                            funcion={funcion}
                            seleccionados={seleccionados}
                            cliente={cliente}
                            total={total}
                        />
                    )}

                </PasoContainer>

                <FormBotones
                    paso={paso}
                    puedeContinuar={puedeContinuar()}
                    onVolver={volver}
                    onContinuar={continuar}
                    onConfirmar={confirmarCompra}
                />
            </ScrollView>
        </SafeAreaView>
    );
}