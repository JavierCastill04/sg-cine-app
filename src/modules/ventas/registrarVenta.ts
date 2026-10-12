
import * as Crypto from "expo-crypto";
import type { Dispatch } from "@reduxjs/toolkit";
import type { Funcion } from "../../types/Funcion";
import type { Pelicula } from "../../types/Pelicula";
import type { Venta } from "../../types/Venta";
import type { Usuario } from "../../types/Usuario";
import { addVenta } from "../../redux/slices/ventaSlice";
import { reserveAsientos } from "../../redux/slices/funcionSlice";

interface DatosCompra {
    funcion: Funcion;
    pelicula: Pelicula;
    usuario: Usuario;
    asientos: string[];
    total: number;
}

export const registrarVenta = (
    dispatch: Dispatch,
    datos: DatosCompra
): Venta => {
    const fechaFin = new Date(
        `${datos.funcion.fecha}T${datos.funcion.horaInicio}`
    );

    fechaFin.setMinutes(
        fechaFin.getMinutes() + datos.pelicula.duracion
    );

    const venta: Venta = {
        id: 0,
        funcionId: datos.funcion.id,
        usuario: datos.usuario,
        asientos: datos.asientos,
        cantidadBoletos: datos.asientos.length,
        total: datos.total,
        fechaVenta: new Date().toISOString(),
        token: Crypto.randomUUID(),
        tokenExpira: fechaFin.toISOString(),
        tokenUsado: false,
    };

    dispatch(addVenta(venta));

    dispatch(
        reserveAsientos({
            funcionId: datos.funcion.id,
            asientos: datos.asientos,
        })
    );

    return venta;
};