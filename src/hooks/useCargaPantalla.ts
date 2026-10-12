import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

interface UseCargaPantallaOptions {
    cargar: () => Promise<unknown>;
}

export function useCargaPantalla({ cargar }: UseCargaPantallaOptions) {
    const [cargando, setCargando] = useState(true);
    const [actualizando, setActualizando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [datosCargados, setDatosCargados] = useState(false);

    const ejecutarCarga = useCallback(async (inicial: boolean) => {
        if (inicial) {
            setCargando(true);
        } else {
            setActualizando(true);
        }

        setError(null);

        try {
            await cargar();
            setDatosCargados(true);
        } catch (err) {
            setError(
                typeof err === 'string'
                    ? err
                    : err instanceof Error
                        ? err.message
                        : 'No se pudo cargar la información.'
            );
        } finally {
            setCargando(false);
            setActualizando(false);
        }
    }, [cargar]);

    useFocusEffect(
        useCallback(() => {
            let activo = true;

            const ejecutar = async () => {
                if (!datosCargados) {
                    setCargando(true);
                }

                setError(null);

                try {
                    await cargar();

                    if (activo) {
                        setDatosCargados(true);
                    }
                } catch (err) {
                    if (activo) {
                        setError(
                            typeof err === 'string'
                                ? err
                                : err instanceof Error
                                    ? err.message
                                    : 'No se pudo cargar la información.'
                        );
                    }
                } finally {
                    if (activo) {
                        setCargando(false);
                    }
                }
            };

            void ejecutar();

            return () => {
                activo = false;
            };
        }, [cargar, datosCargados])
    );

    const actualizar = useCallback(
        () => ejecutarCarga(false),
        [ejecutarCarga]
    );

    const reintentar = useCallback(
        () => ejecutarCarga(true),
        [ejecutarCarga]
    );

    return {
        cargando,
        actualizando,
        error,
        datosCargados,
        actualizar,
        reintentar,
    };
}