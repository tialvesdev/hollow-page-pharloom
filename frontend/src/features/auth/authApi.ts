import { api } from '../../app/api';

export type Conta = { id: string; nome: string; email: string };
export type DadosEntrada = { email: string; senha: string };
export type DadosCadastro = { nome: string; email: string; senha: string };

export const authApi = api.injectEndpoints({
  endpoints: (b) => ({
    sessao: b.query<Conta | null, void>({
      // 401 aqui só quer dizer "ninguém entrou", não é erro.
      queryFn: async (_arg, _api, _extra, base) => {
        const r = await base('/auth/eu');
        if (r.error?.status === 401) return { data: null };
        if (r.error) return { error: r.error };
        return { data: r.data as Conta };
      },
      providesTags: ['Sessao'],
    }),
    entrar: b.mutation<Conta, DadosEntrada>({
      query: (corpo) => ({ url: '/auth/entrar', method: 'POST', body: corpo }),
      invalidatesTags: ['Sessao'],
    }),
    cadastrar: b.mutation<Conta, DadosCadastro>({
      query: (corpo) => ({ url: '/auth/cadastro', method: 'POST', body: corpo }),
      invalidatesTags: ['Sessao'],
    }),
    sair: b.mutation<void, void>({
      query: () => ({ url: '/auth/sair', method: 'POST' }),
      invalidatesTags: ['Sessao'],
    }),
  }),
});

export const { useSessaoQuery, useEntrarMutation, useCadastrarMutation, useSairMutation } = authApi;
