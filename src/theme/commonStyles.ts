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
        color: colores.enfasis,
        marginBottom: espaciado.md,
    },

    subtitle: {
        ...tipografia.subtitle,
        color: colores.superficie,
        marginTop: espaciado.xl,
        marginBottom: espaciado.md,
        textAlign: "center",
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
        textAlign: 'center',
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

    inputView: {
        marginBottom: espaciado.sm,
        marginTop: espaciado.sm,
    },

    card: {
        backgroundColor: colores.secundario,
        padding: espaciado.xl,
        marginBottom: espaciado.md,
        borderRadius: layout.radius,
        borderColor: colores.enfasis,
        borderLeftWidth: 4,
        borderLeftColor: colores.enfasis,
    },

    cardTitle: {
        ...tipografia.heading,
        color: colores.enfasis,
        marginBottom: espaciado.sm,
    },

    floatingButton: {
        position: 'absolute',
        right: espaciado.xl,
        bottom: espaciado.xl,
        width: 70,
        height: 70,
        borderRadius: 50,
        borderColor: colores.darkOliva,
        borderWidth: 2,
        backgroundColor: colores.oliva,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: espaciado.lg,
    },

    modal: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: colores.secundario,
        borderRadius: layout.radius,
        padding: espaciado.xl,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colores.superficie,
        marginBottom: espaciado.xs,
    },

    labelBlack: {
        fontSize: 14,
        fontWeight: '600',
        color: colores.negro,
        marginBottom: espaciado.xs,
    },

    modalButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: espaciado.sm,
        marginTop: espaciado.lg,
    },

    modalButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colores.enfasis,
        borderRadius: layout.radius,
        paddingVertical: espaciado.md,
        paddingHorizontal: espaciado.lg,
        justifyContent: 'center',
    },

    modalButtonCancelar: {
        flex: 3,
        backgroundColor: colores.rojo,
        borderWidth: 1,
        borderRadius: layout.radius,
        paddingVertical: espaciado.md,
        alignItems: 'center',
        justifyContent: 'center',
    },

    modalButtonCancelarText: {
        fontSize: 16,
        fontWeight: '700',
        color: colores.blanco,
    },

    errorText: {
        color: 'red',
        marginTop: 4,
    },

    errorInput: {
        borderColor: 'red',
    },

    centeredContent: {
        flex: 1,
        justifyContent: 'center',
    },

    centeredHeader: {
        alignItems: 'center',
        marginBottom: espaciado.xl,
        gap: espaciado.sm,
    },

    verticalButtons: {
        flexDirection: 'column',
        marginTop: espaciado.lg,
        gap: espaciado.md,
    },

    buttonWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: espaciado.sm,
    },

    profileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: espaciado.sm,
        marginTop: espaciado.lg,
    },

    dangerButton: {
        backgroundColor: colores.rojo,
    },

    dangerButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colores.blanco,
        textAlign: 'center',
    },

    carteleraModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: espaciado.md,
    },

    carteleraModalTitulo: {
        flex: 1,
        color: colores.enfasis,
        fontSize: 20,
        fontWeight: '700',
        marginRight: espaciado.md,
    },

    carteleraModalSubtitulo: {
        color: colores.superficie,
        fontSize: 17,
        fontWeight: '700',
        marginBottom: espaciado.xs,
    },

    carteleraModalEtiquetas: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: espaciado.sm,
        marginBottom: espaciado.xl,
    },

    carteleraModalEtiqueta: {
        backgroundColor: colores.superficie,
        color: colores.texto,
        borderRadius: layout.radius * 2,
        paddingVertical: espaciado.xs,
        paddingHorizontal: espaciado.md,
        fontSize: 12,
        fontWeight: '600',
    },

    carteleraModalFuncion: {
        backgroundColor: colores.fondo,
        borderRadius: layout.radius,
        padding: espaciado.lg,
        marginTop: espaciado.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    carteleraModalDato: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: espaciado.sm,
    },

    carteleraModalTexto: {
        color: colores.superficie,
        fontSize: 14,
    },

    
    homePopcornRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: espaciado.md,
        opacity: 0.35,
    },

    homeMainContent: {
        flex: 1,
        justifyContent: 'center',
    },

    homeHeader: {
        alignItems: 'center',
        marginBottom: espaciado.xxl,
    },

    homeIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    homeTitle: {
        ...tipografia.title,
        color: colores.enfasis,
        marginTop: espaciado.lg,
    },

    homeSubtitle: {
        ...tipografia.subtitle,
        color: colores.superficie,
        marginTop: espaciado.sm,
        marginBottom: espaciado.sm,
        textAlign: 'center',
    },

    homeDescription: {
        ...tipografia.body,
        color: colores.claro,
        marginTop: espaciado.sm,
        textAlign: 'center',
    },

    homeAccessCard: {
        backgroundColor: colores.secundario,
        padding: espaciado.xl,
        borderRadius: layout.radius,
        borderLeftWidth: 4,
        borderLeftColor: colores.enfasis,
        alignItems: 'center',
        gap: espaciado.md,
    },

    homeAccessButton: {
        width: '100%',
        marginTop: espaciado.md,
    },

});