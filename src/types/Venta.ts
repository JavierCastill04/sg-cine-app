import type { Usuario } from "./Usuario";
export interface Venta {
    id: number;
    funcionId: number;
    usuario?: Usuario;
    asientos: string[];
    cantidadBoletos: number;
    total: number;
    fechaVenta?: string;
    token: string;
    tokenExpira?: string;
    tokenUsado: boolean;

    peliculaNombre?: string;
    salaNombre?: string;
    fechaHoraFuncion?: string;
    cineNombre?: string;
    estadoReserva?: "activa" | "utilizada" | "cancelada";
}