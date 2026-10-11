
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
    Popcorn,
    Film,
    Fingerprint,
    ShieldCheck,
} from 'lucide-react-native';

import type { RootStackParamList } from '../../../navigation/types';
import { commonStyles, colores } from '../../../theme';

import {
    useAppDispatch,
    useAppSelector,
} from '../../../redux/hooks';

import {
    autorizarAccesoPersonal,
    revocarAccesoPersonal,
} from '../../../redux/slices/authSlice';

import {
    biometriaDisponible,
    autenticarBiometria,
} from '../../auth/utils/biometria';

import Separador from '../../../components/separador/Separador';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const dispatch = useAppDispatch();

    const [verificando, setVerificando] = useState(false);
    const navegacionPendiente = useRef(false);
    const intentoEnCurso = useRef(false);

    const {
        autenticado,
        usuario,
        accesoPersonalAutorizado,
        versionSesion,
    } = useAppSelector(state => state.auth);

    const esPersonal =
        autenticado && usuario?.rol === 'personal';

    useEffect(() => {
        if (
            navegacionPendiente.current &&
            esPersonal &&
            accesoPersonalAutorizado
        ) {
            navegacionPendiente.current = false;
            navigation.navigate('PersonalNavigator');
        }
    }, [
        esPersonal,
        accesoPersonalAutorizado,
        navigation,
    ]);

    const verificarAcceso = async () => {
        if (!esPersonal || !usuario) {
            Alert.alert(
                'Acceso restringido',
                'Debes iniciar sesión con una cuenta de personal.'
            );
            return;
        }

        if (intentoEnCurso.current) {
            return;
        }

        intentoEnCurso.current = true;
        setVerificando(true);
        navegacionPendiente.current = false;

        dispatch(revocarAccesoPersonal());

        const usuarioId = usuario.id;
        const versionAlIniciar = versionSesion;

        try {
            const disponible = await biometriaDisponible();

            if (!disponible) {
                Alert.alert(
                    'Biometría no disponible',
                    'El dispositivo no tiene biometría registrada.'
                );
                return;
            }

            const verificado = await autenticarBiometria();

            if (!verificado) {
                Alert.alert(
                    'Acceso denegado',
                    'La verificación biométrica no se completó.'
                );
                return;
            }

            const resultado = dispatch(
                autorizarAccesoPersonal({
                    usuarioId,
                    versionSesion: versionAlIniciar,
                })
            );

            if (resultado.type === autorizarAccesoPersonal.type) {
                navegacionPendiente.current = true;
            }
        } catch {
            Alert.alert(
                'Error',
                'No fue posible realizar la verificación biométrica.'
            );
        } finally {
            intentoEnCurso.current = false;
            setVerificando(false);
        }
    };

    return (
        <SafeAreaView style={commonStyles.containerScreen}>
            <Separador />

            <View style={commonStyles.homePopcornRow}>
                {Array.from({ length: 12 }).map((_, index) => (
                    <Popcorn
                        key={index}
                        size={22}
                        color={colores.enfasis}
                    />
                ))}
            </View>

            <Separador />

            <View style={commonStyles.homeMainContent}>
                <View style={commonStyles.homeHeader}>
                    <View style={commonStyles.homeIconRow}>
                        <Film
                            size={80}
                            color={colores.enfasis}
                        />
                    </View>

                    <Text style={commonStyles.homeTitle}>
                        CINE APP
                    </Text>

                    <Text style={commonStyles.homeSubtitle}>
                        Zona de Personal
                    </Text>

                    <Text style={commonStyles.homeDescription}>
                        Verifica tu identidad para acceder
                        a las herramientas administrativas.
                    </Text>
                </View>

                <View style={commonStyles.homeAccessCard}>
                    <ShieldCheck
                        size={55}
                        color={colores.enfasis}
                    />

                    <Text style={commonStyles.cardTitle}>
                        Acceso protegido
                    </Text>

                    <Text style={commonStyles.homeDescription}>
                        {esPersonal
                            ? `Bienvenido, ${usuario?.nombre}`
                            : 'Se requiere una cuenta de personal.'}
                    </Text>

                    <TouchableOpacity
                        style={[
                            commonStyles.button,
                            commonStyles.homeAccessButton,
                        ]}
                        onPress={verificarAcceso}
                        disabled={verificando}
                    >
                        <View style={commonStyles.buttonWithIcon}>
                            <Fingerprint
                                size={22}
                                color={colores.negro}
                            />

                            <Text style={commonStyles.buttonText}>
                                {verificando
                                    ? 'Verificando...'
                                    : 'Verificar biometría'}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            commonStyles.button,
                            commonStyles.dangerButton,
                            commonStyles.homeAccessButton,
                        ]}
                        onPress={() => {
                            navegacionPendiente.current = false;
                            navigation.navigate('ClienteNavigator');
                        }}
                    >
                        <Text style={commonStyles.dangerButtonText}>
                            Volver a Cartelera
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Separador />

            <View style={commonStyles.homePopcornRow}>
                {Array.from({ length: 12 }).map((_, index) => (
                    <Popcorn
                        key={index}
                        size={22}
                        color={colores.enfasis}
                    />
                ))}
            </View>

            <Separador />
        </SafeAreaView>
    );
}
