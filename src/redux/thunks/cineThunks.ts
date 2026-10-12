
import { createAsyncThunk } from '@reduxjs/toolkit';
import { cinesService, type Cine } from '../../services/cines.service';

export const cargarCines = createAsyncThunk<
    Cine[],
    void,
    { rejectValue: string }
>(
    'cine/cargar',
    async (_, { rejectWithValue }) => {
        try {
            return await cinesService.listar();
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'No se pudieron cargar los cines.'
            );
        }
    }
);