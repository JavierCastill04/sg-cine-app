import { api } from './api';

export interface FuncionApi {
    id: number;
    peliculaId: number;
    salaId: number;
    fechaHora: string;
    estado: 'activa' | 'cancelada';
    pelicula: string;
    duracion: number;
    clasificacion: string;
    sala: string;
    cineId: number;
    cine: string;
    direccion: string;
}

export interface CrearFuncionRequest {
    peliculaId: number;
    salaId: number;
    fechaHora: string;
}

export interface FiltrosFunciones {
    peliculaId?: number;
    cineId?: number;
}

export interface AsientoFuncionApi {
    asiento: string;
    estado: 'libre' | 'ocupado';
}

export interface AsientosFuncion {
    funcionId: number;
    estado: 'activa' | 'cancelada';
    sala: string;
    filas: number;
    columnas: number;
    asientos: AsientoFuncionApi[];
}

interface RespuestaFuncion {
    message: string;
    funcion: {
        id: number;
        peliculaId: number;
        salaId: number;
        fechaHora: string;
        estado: 'activa' | 'cancelada';
    };
}

export interface RespuestaCancelacion {
    message: string;
    id: number;
    estado: 'cancelada';
    notificaciones: {
        reservasNotificadas: number;
        aceptadasPorExpo: number;
        fallidas: number;
    } | null;
}

const BASE_URL = '/funciones';

export const funcionesService = {
    listar: (filtros?: FiltrosFunciones) => {
        const params = new URLSearchParams();

        if (filtros?.peliculaId !== undefined) {
            params.append('peliculaId', String(filtros.peliculaId));
        }

        if (filtros?.cineId !== undefined) {
            params.append('cineId', String(filtros.cineId));
        }

        const query = params.toString();

        return api.get<FuncionApi[]>(
            query ? `${BASE_URL}?${query}` : BASE_URL
        );
    },

    obtenerPorId: (id: number) =>
        api.get<FuncionApi>(`${BASE_URL}/${id}`),

    obtenerAsientos: (id: number) =>
        api.get<AsientosFuncion>(`${BASE_URL}/${id}/asientos`),

    crear: (datos: CrearFuncionRequest) =>
        api.post<RespuestaFuncion>(
            BASE_URL,
            datos,
            true
        ),

    actualizar: (id: number, datos: CrearFuncionRequest) =>
        api.put<RespuestaFuncion>(
            `${BASE_URL}/${id}`,
            datos,
            true
        ),

    cancelar: (id: number) =>
        api.patch<RespuestaCancelacion>(
            `${BASE_URL}/${id}/cancelar`,
            undefined,
            true
        ),
};