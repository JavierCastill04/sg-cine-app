import { combineReducers } from '@reduxjs/toolkit';

import funcionReducer from './slices/funcionSlice';
import peliculaReducer from './slices/peliculaSlice';
import ventaReducer from './slices/ventaSlice';

const rootReducer = combineReducers({
    funcion: funcionReducer,
    pelicula: peliculaReducer,
    venta: ventaReducer,
});

export default rootReducer;