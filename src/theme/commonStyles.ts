import { StyleSheet } from 'react-native';

import { colores } from './colores';
import { espaciado } from './espaciado';
import { tipografia } from './tipografia';
import { layout } from './layout';

export const commonStyles = StyleSheet.create({

    containerScreen: {
        flex: 1,
        backgroundColor: colores.fondo,
        paddingLeft: espaciado.xl,
        paddingRight: espaciado.xl,
        paddingTop: espaciado.md,
        paddingBottom: espaciado.md,
    },

    surface: {
        backgroundColor: colores.superficie,
        borderRadius: layout.radius,
    },

    title: {
        ...tipografia.title,
        color: colores.superficie,
        marginBottom: espaciado.md,
    },

    subtitle: {
        ...tipografia.subtitle,
        color: colores.superficie,
        marginBottom: espaciado.md,
    },

    heading: {
        ...tipografia.heading,
        color: colores.texto,
        marginBottom: espaciado.sm,
    },

    text: {
        ...tipografia.body,
        color: colores.superficie,
    },

    secondaryText: {
        ...tipografia.body,
        color: colores.textoSecundario,
    },

    button: {
        backgroundColor: colores.enfasis,
        borderRadius: layout.radius,
        paddingVertical: espaciado.md,
        paddingHorizontal: espaciado.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colores.primario,
    },

    cardButton: {
        flex: 1,
        backgroundColor: colores.enfasis,
        borderRadius: layout.radius,
        paddingVertical: espaciado.sm,
        paddingHorizontal: espaciado.md,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cardButtonContainter: {
        flexDirection: 'row',
        gap: espaciado.sm,
        paddingTop: espaciado.xl
    },

    input: {
        borderWidth: 1,
        borderColor: colores.borde,
        borderRadius: layout.radius,
        paddingVertical: espaciado.md,
        paddingHorizontal: espaciado.lg,
        backgroundColor: colores.superficie,
        color: colores.texto,
    },

    card: {
        backgroundColor: colores.secundario,
        padding: espaciado.xl,
        marginBottom: espaciado.md,
        borderWidth: 1,
        borderRadius: layout.radius,
        borderColor: colores.enfasis,
    },

    cardTitle: {
        ...tipografia.heading,
        color: colores.enfasis,
        marginBottom: espaciado.sm,
    },

});