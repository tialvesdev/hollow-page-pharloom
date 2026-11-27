import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';

export function criarStore() {
  return configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (padrao) => padrao().concat(api.middleware),
  });
}

export const store = criarStore();

export type Store = ReturnType<typeof criarStore>;
export type EstadoRaiz = ReturnType<Store['getState']>;
export type Despacho = Store['dispatch'];
