import { combineReducers } from '@reduxjs/toolkit';

import funcionReducer from './slices/funcionSlice';
import peliculaReducer from './slices/peliculaSlice';
import ventaReducer from './slices/ventaSlice';
import salaReducer from './slices/salaSlice';
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({
    funcion: funcionReducer,
    pelicula: peliculaReducer,
    venta: ventaReducer,
    sala: salaReducer,
    auth: authReducer
});

export default rootReducer;