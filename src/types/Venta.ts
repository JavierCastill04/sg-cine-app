export interface Venta {
    id: number;
    funcionId: number;
    cliente: {
        nombre: string;
        correo: string;
        telefono: string;
    };
    asientos: string[];
    cantidadBoletos: number;
    total: number;
    fechaVenta: string;
}