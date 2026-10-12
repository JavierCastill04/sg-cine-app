import { createSlice } from '@reduxjs/toolkit';
import type { Cine } from '../../services/cines.service';
import { cargarCines } from '../thunks/cineThunks';

interface CineState {
    lista: Cine[];
    cargando: boolean;
    error: string | null;
}

const initialState: CineState = {
    lista: [],
    cargando: false,
    error: null,
};

const cineSlice = createSlice({
    name: 'cine',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(cargarCines.pending, state => {
                state.cargando = true;
                state.error = null;
            })
            .addCase(cargarCines.fulfilled, (state, action) => {
                state.lista = action.payload;
                state.cargando = false;
                state.error = null;
            })
            .addCase(cargarCines.rejected, (state, action) => {
                state.cargando = false;
                state.error =
                    action.payload ?? 'No se pudieron cargar los cines.';
            });
    },
});

export default cineSlice.reducer;