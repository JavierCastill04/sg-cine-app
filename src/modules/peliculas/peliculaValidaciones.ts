import type { Pelicula } from "../../types/Pelicula";

export interface DatosPelicula {
    codigo: string;
    nombre: string;
    genero: string;
    duracion: string;
    clasificacion: string;
    precio: string;
}

export interface ErroresPelicula {
    codigo?: string;
    nombre?: string;
    genero?: string;
    duracion?: string;
    clasificacion?: string;
    precio?: string;
}

export const validarCampo = (
    campo: keyof DatosPelicula,
    valor: string,
    peliculas: Pelicula[],
    peliculaEditando: number | null
): string | undefined => {
    const texto = valor.trim();

    if (["codigo", "nombre", "genero", "clasificacion"].includes(campo) && !texto) {
        return "Este campo es obligatorio.";
    }

    if (campo === "codigo") {
        if (!/^PEL-\d{3}$/.test(texto)) return "Debe tener el formato PEL-001.";
        if (peliculas.some(p => p.id !== peliculaEditando && p.codigo.toLowerCase() === texto.toLowerCase())) {
            return "Este código ya existe.";
        }
    }

    if (campo === "duracion") {
        const numero = Number(valor);
        if (!texto || isNaN(numero) || numero <= 0) return "Debe ser mayor que 0 minutos.";
    }

    if (campo === "precio") {
        const numero = Number(valor);
        if (!texto || isNaN(numero) || numero <= 0) {
            return "Debe ser un número mayor que 0.";
        }
    }
};

export const validarPelicula = (
    datos: DatosPelicula,
    peliculas: Pelicula[],
    peliculaEditando: number | null
) => {
    const errores: ErroresPelicula = {};

    (Object.keys(datos) as (keyof DatosPelicula)[]).forEach(campo => {
        const error = validarCampo(campo, datos[campo], peliculas, peliculaEditando);
        if (error) errores[campo] = error;
    });

    return errores;
};