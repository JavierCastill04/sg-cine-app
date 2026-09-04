export interface EstadoAsiento {
    asientoId: string;
    estado: "disponible" | "reservado" | "seleccionado";
}