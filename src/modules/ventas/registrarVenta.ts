import * as Crypto from "expo-crypto";
import type { Dispatch } from "@reduxjs/toolkit";
import type { Funcion } from "../../types/Funcion";
import type { Pelicula } from "../../types/Pelicula";
import type { Venta } from "../../types/Venta";
import { addVenta } from "../../redux/slices/ventaSlice";
import { reserveAsientos } from "../../redux/slices/funcionSlice";
import { Cliente } from "../../types/Cliente";

interface DatosCompra {
    funcion: Funcion;
    pelicula: Pelicula;
    cliente: Cliente;
    asientos: string[];
    total: number;
}

export const registrarVenta = (dispatch: Dispatch, datos: DatosCompra): Venta => {

    const fechaFin = new Date(`${datos.funcion.fecha}T${datos.funcion.horaInicio}`);
    fechaFin.setMinutes(fechaFin.getMinutes() + datos.pelicula.duracion);
    const token = Crypto.randomUUID();
    const venta: Venta = {
        id: 0,
        funcionId: datos.funcion.id,
        cliente: datos.cliente,
        asientos: datos.asientos,
        cantidadBoletos: datos.asientos.length,
        total: datos.total,
        fechaVenta: new Date().toISOString(),
        token,
        tokenExpira: fechaFin.toISOString(),
        tokenUsado: false
    };

    dispatch(addVenta(venta));
    dispatch(
        reserveAsientos({
            funcionId: datos.funcion.id,
            asientos: datos.asientos
        })
    );

    return venta;
};