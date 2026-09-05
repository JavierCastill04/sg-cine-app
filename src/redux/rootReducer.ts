import { combineReducers } from '@reduxjs/toolkit';

import funcionReducer from './slices/funcionSlice';
import peliculaReducer from './slices/peliculaSlice';
import ventaReducer from './slices/ventaSlice';
import salaReducer from './slices/salaSlice';

const rootReducer = combineReducers({
    funcion: funcionReducer,
    pelicula: peliculaReducer,
    venta: ventaReducer,
    sala: salaReducer,
});

export default rootReducer;