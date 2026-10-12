import type { Usuario } from "./Usuario";
export interface Venta {
    id: number;
    funcionId: number;
    usuario: Usuario;
    asientos: string[];
    cantidadBoletos: number;
    total: number;
    fechaVenta: string;
    token: string;
    tokenExpira: string;
    tokenUsado: boolean;
}