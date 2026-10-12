
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const CLAVE_RECORDATORIOS = '@sgcine:recordatorios';

type RecordatoriosGuardados = Record<string, string>;

export const notificacionesService = {
    async configurar(): Promise<boolean> {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('recordatorios', {
                name: 'Recordatorios de funciones',
                importance: Notifications.AndroidImportance.HIGH,
            });
        }

        const permisosActuales = await Notifications.getPermissionsAsync();

        if (permisosActuales.granted) {
            return true;
        }

        const nuevosPermisos = await Notifications.requestPermissionsAsync();

        return nuevosPermisos.granted;
    },

    async notificarCompra(pelicula: string): Promise<string> {
        return Notifications.scheduleNotificationAsync({
            content: {
                title: '¡Compra confirmada!',
                body: `Tu reserva para ${pelicula} se realizó correctamente.`,
                data: { tipo: 'COMPRA_CONFIRMADA' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 5,
                channelId: 'recordatorios',
            },
        });
    },

    async programarRecordatorio(
        codigoReserva: string,
        pelicula: string,
        fechaHora: string,
        modoDemostracion = false
    ): Promise<string | null> {
        const inicioFuncion = new Date(fechaHora);

        if (Number.isNaN(inicioFuncion.getTime())) {
            throw new Error('La fecha de la función no es válida.');
        }

        const fechaRecordatorio = modoDemostracion
            ? new Date(Date.now() + 60 * 1000)
            : new Date(inicioFuncion.getTime() - 60 * 60 * 1000);

        if (!modoDemostracion && fechaRecordatorio.getTime() <= Date.now()) {
            return null;
        }

        await this.cancelarRecordatorio(codigoReserva);

        const identificador = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Tu función está próxima',
                body: modoDemostracion
                    ? `Recordatorio de prueba para ${pelicula}.`
                    : `${pelicula} comienza en una hora.`,
                data: {
                    tipo: 'RECORDATORIO_FUNCION',
                    codigoReserva,
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: fechaRecordatorio,
                channelId: 'recordatorios',
            },
        });

        const guardados = await this.obtenerRecordatorios();

        guardados[codigoReserva] = identificador;

        await AsyncStorage.setItem(
            CLAVE_RECORDATORIOS,
            JSON.stringify(guardados)
        );

        return identificador;
    },

    async obtenerRecordatorios(): Promise<RecordatoriosGuardados> {
        const datos = await AsyncStorage.getItem(CLAVE_RECORDATORIOS);

        return datos ? JSON.parse(datos) as RecordatoriosGuardados : {};
    },

    async cancelarRecordatorio(codigoReserva: string): Promise<void> {
        const guardados = await this.obtenerRecordatorios();
        const identificador = guardados[codigoReserva];

        if (!identificador) {
            return;
        }

        await Notifications.cancelScheduledNotificationAsync(identificador);

        delete guardados[codigoReserva];

        await AsyncStorage.setItem(
            CLAVE_RECORDATORIOS,
            JSON.stringify(guardados)
        );
    },

    async cancelarTodosLosRecordatorios(): Promise<void> {
        const guardados = await this.obtenerRecordatorios();

        for (const identificador of Object.values(guardados)) {
            await Notifications.cancelScheduledNotificationAsync(identificador);
        }

        await AsyncStorage.removeItem(CLAVE_RECORDATORIOS);
    },
};
