import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * API única do app (RTK Query). Cada área injeta suas rotas com api.injectEndpoints.
 * As chamadas vão para /api no mesmo domínio: proxy do Vite em dev, rewrite do Vercel em produção.
 */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api', credentials: 'include' }),
  tagTypes: ['Sessao'],
  endpoints: () => ({}),
});

/** Formato de erro que a API devolve: { mensagem, campos }. */
export type ErroDaApi = { mensagem: string; campos: Record<string, string> };

export function lerErro(erro: unknown): ErroDaApi {
  if (erro && typeof erro === 'object' && 'data' in erro) {
    const dados = (erro as { data?: Partial<ErroDaApi> }).data;
    if (dados && typeof dados.mensagem === 'string') {
      return { mensagem: dados.mensagem, campos: dados.campos ?? {} };
    }
  }
  if (
    erro &&
    typeof erro === 'object' &&
    'status' in erro &&
    (erro as { status: unknown }).status === 'FETCH_ERROR'
  ) {
    return {
      mensagem: 'Não deu para falar com o servidor. Confira sua conexão e tente de novo.',
      campos: {},
    };
  }
  return { mensagem: 'Algo deu errado do nosso lado. Tente de novo em instantes.', campos: {} };
}
