import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Sala } from "../../types/Sala";
import { salasData } from "../../data/salasData";
import { generarAsientos } from "../../components/asientos/asientosUtils";



const initialState: Sala[] = salasData.map((sala) => ({
    ...sala, asiento: generarAsientos(
        sala.id,
        sala.capacidad.filas,
        sala.capacidad.columnas
    )
}))

const salaSlice = createSlice({
    name: "sala",
    initialState,
    reducers: {
        addSala: (state, action: PayloadAction<Omit<Sala, 'id' | 'asientos'>>) => {
            const nuevoId = state.length > 0 ? Math.max(...state.map(s => s.id)) + 1 : 1;
            const salaExistente = state.find(
                sala => sala.nombre === action.payload.nombre
            );

            if (salaExistente) {
                //Notificar al usuario directamente, hacer luego.
                console.log(`La ${action.payload.nombre} ya existe. No se puede agregar.`);

            } else {
                state.push({
                    id: nuevoId,
                    ...action.payload,
                    asientos: generarAsientos(nuevoId, action.payload.capacidad.filas, action.payload.capacidad.columnas)
                });
            }
        },

        updateSala: (state, action: PayloadAction<Sala>) => {
            const salaId = state.findIndex(sala => sala.id === action.payload.id);
            if (salaId !== -1) {
                const salaActual = state[salaId];

                const capacidadNueva = action.payload.capacidad;
                //Evaluar si cambian las dimensiones
                if (salaActual.capacidad.filas !== capacidadNueva.filas || salaActual.capacidad.columnas !== capacidadNueva.columnas) {
                    {
                        state[salaId] = {
                            ...action.payload,
                            asientos: generarAsientos(action.payload.id, capacidadNueva.filas, capacidadNueva.columnas)
                        };
                    }
                }
                else {
                    state[salaId] = {
                        ...state[salaId],
                        ...action.payload
                    };
                }
            }
            else {
                //Notificar al usuario directamente, hacer luego.
                console.log(`No se encuentra la sala indicada`);
            }
        },

        removeSala: (state, action: PayloadAction<number>) => {
            const salaId = state.findIndex(sala => sala.id === action.payload);
            if (salaId !== -1) {
                state.splice(salaId, 1);
            }
            else {
                //Notificar al usuario directamente, hacer luego.
                console.log(`La sala no se pudo eliminar.`);
            }
        }
    }
});

export const { addSala, updateSala, removeSala } = salaSlice.actions;
export default salaSlice.reducer;