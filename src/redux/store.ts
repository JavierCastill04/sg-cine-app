import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    persistStore,
    persistReducer,
    createTransform,
    type PersistConfig,
} from 'redux-persist';

import rootReducer from './rootReducer';
import type { AuthState } from '../types/AuthState';

const authTransform = createTransform<AuthState, AuthState>(
    (inboundState) => ({
        ...inboundState,
        token: null,
    }),
    (outboundState) => ({
        ...outboundState,
        autenticado: false,
        usuario: null,
        token: null,
        accesoPersonalAutorizado: false,
    }),
    { whitelist: ['auth'] }
);

const persistConfig: PersistConfig<
    ReturnType<typeof rootReducer>
> = {
    key: 'root',
    storage: AsyncStorage,
    transforms: [authTransform],
};

const persistedReducer = persistReducer(
    persistConfig,
    rootReducer
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;