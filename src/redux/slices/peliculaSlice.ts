
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pelicula } from '../../types/Pelicula';
import { cargarPeliculas, crearPeliculaThunk, actualizarPeliculaThunk, eliminarPeliculaThunk, cambiarDisponibilidadThunk, } from '../thunks/peliculaThunks';

interface PeliculaState {
    lista: Pelicula[];
    cargando: boolean;
    error: string | null;
}

const initialState: PeliculaState = {
    lista: [],
    cargando: false,
    error: null,
};

const peliculaSlice = createSlice({
    name: 'pelicula',
    initialState,
    reducers: {
        setPeliculas: (state, action: PayloadAction<Pelicula[]>) => {
            state.lista = action.payload;
        },
        addPelicula: (state, action: PayloadAction<Pelicula>) => {
            state.lista.push(action.payload);
        },
        updatePelicula: (state, action: PayloadAction<Pelicula>) => {
            const indice = state.lista.findIndex(
                pelicula => pelicula.id === action.payload.id
            );

            if (indice !== -1) {
                state.lista[indice] = action.payload;
            }
        },
        removePelicula: (state, action: PayloadAction<number>) => {
            state.lista = state.lista.filter(
                pelicula => pelicula.id !== action.payload
            );
        },
        limpiarError: state => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            // Listar
            .addCase(cargarPeliculas.pending, state => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(cargarPeliculas.fulfilled, (state, action) => {
                state.cargando = false;
                state.lista = action.payload;
            })
            .addCase(cargarPeliculas.rejected, (state, action) => {
                state.cargando = false;
                state.error =
                    action.payload ?? 'No se pudieron cargar las películas.';
            })

            // Crear
            .addCase(crearPeliculaThunk.pending, state => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(crearPeliculaThunk.fulfilled, (state, action) => {
                state.cargando = false;
                state.lista.push(action.payload);
            })
            .addCase(crearPeliculaThunk.rejected, (state, action) => {
                state.cargando = false;
                state.error =
                    action.payload ?? 'No se pudo crear la película.';
            })

            // Actualizar
            .addCase(actualizarPeliculaThunk.pending, state => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(actualizarPeliculaThunk.fulfilled, (state, action) => {
                state.cargando = false;

                const pelicula = state.lista.find(
                    item => item.id === action.payload.id
                );

                if (pelicula) {
                    Object.assign(pelicula, {
                        ...action.payload.datos,
                        precio: action.payload.datos.precio,
                    });
                }
            })
            .addCase(actualizarPeliculaThunk.rejected, (state, action) => {
                state.cargando = false;
                state.error =
                    action.payload ?? 'No se pudo actualizar la película.';
            })

            // Eliminar
            .addCase(eliminarPeliculaThunk.pending, state => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(eliminarPeliculaThunk.fulfilled, (state, action) => {
                state.cargando = false;
                state.lista = state.lista.filter(
                    pelicula => pelicula.id !== action.payload
                );
            })
            .addCase(eliminarPeliculaThunk.rejected, (state, action) => {
                state.cargando = false;
                state.error =
                    action.payload ?? 'No se pudo eliminar la película.';
            })

            // Cambiar disponibilidad
            .addCase(cambiarDisponibilidadThunk.pending, state => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(cambiarDisponibilidadThunk.fulfilled, (state, action) => {
                state.cargando = false;

                const pelicula = state.lista.find(
                    item => item.id === action.payload.id
                );

                if (pelicula) {
                    pelicula.disponible = action.payload.disponible;
                }
            })
            .addCase(cambiarDisponibilidadThunk.rejected, (state, action) => {
                state.cargando = false;
                state.error =
                    action.payload ?? 'No se pudo cambiar la disponibilidad.';
            });
    },
});

export const {
    setPeliculas,
    addPelicula,
    updatePelicula,
    removePelicula,
    limpiarError,
} = peliculaSlice.actions;

export default peliculaSlice.reducer;