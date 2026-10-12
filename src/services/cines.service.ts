
import { api } from './api';

export interface Cine {
  id: number;
  nombre: string;
  direccion: string;
  latitud: string | null;
  longitud: string | null;
}

const BASE_URL = '/cines';

export const cinesService = {
  listar: () => api.get<Cine[]>(BASE_URL),
};
