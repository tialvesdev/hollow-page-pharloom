import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import { criarStore } from '../app/store';
import { validar } from '../features/auth/validar';
import { Acesso } from './Acesso';

function resposta(status: number, corpo?: unknown) {
  return new Response(corpo === undefined ? null : JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Simula a API: /auth/eu responde 401 até alguém entrar. */
function apiFalsa(entrar: (corpo: Record<string, string>) => Response) {
  let logado = false;
  return vi.fn(async (req: Request) => {
    const url = new URL(req.url);
    if (url.pathname.endsWith('/auth/eu')) {
      return logado
        ? resposta(200, { id: '1', nome: 'lira', email: 'lira@exemplo.test' })
        : resposta(401);
    }
    if (url.pathname.endsWith('/auth/entrar')) {
      const r = entrar(await req.json());
      logado = r.status === 200;
      return r;
    }
    return resposta(404);
  });
}

function montar(modo: 'entrar' | 'criar') {
  return render(
    <Provider store={criarStore()}>
      <MemoryRouter initialEntries={[modo === 'entrar' ? '/entrar' : '/criar-conta']}>
        <Routes>
          <Route path="/entrar" element={<Acesso modo="entrar" />} />
          <Route path="/criar-conta" element={<Acesso modo="criar" />} />
          <Route path="/mapa" element={<p>tela do mapa</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('validar', () => {
  it('pede nome, e-mail e senha válidos ao criar conta', () => {
    expect(validar('criar', { nome: 'a b', email: 'x', senha: 'curta' })).toEqual({
      nome: 'Use de 3 a 24 letras, números ou _, sem espaços.',
      email: 'Esse e-mail não parece válido.',
      senha: 'A senha precisa ter de 8 a 72 caracteres.',
    });
  });

  it('não cobra nome nem tamanho de senha ao entrar', () => {
    expect(validar('entrar', { nome: '', email: 'lira@exemplo.test', senha: 'x' })).toEqual({});
  });
});

describe('Acesso', () => {
  it('mostra os erros dos campos sem chamar a API quando o formulário está vazio', async () => {
    const fetch = apiFalsa(() => resposta(200));
    vi.stubGlobal('fetch', fetch);
    montar('entrar');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(screen.getByText('Informe seu e-mail.')).toBeInTheDocument();
    expect(screen.getByText('Informe sua senha.')).toBeInTheDocument();
    expect(fetch.mock.calls.some(([r]) => (r as Request).url.endsWith('/auth/entrar'))).toBe(false);
  });

  it('mostra a mensagem da API quando a senha não confere', async () => {
    vi.stubGlobal(
      'fetch',
      apiFalsa(() => resposta(401, { mensagem: 'E-mail ou senha não conferem.', campos: {} })),
    );
    montar('entrar');
    await userEvent.type(screen.getByLabelText('E-mail'), 'lira@exemplo.test');
    await userEvent.type(screen.getByLabelText('Senha'), 'errada-123');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('E-mail ou senha não conferem.');
  });

  it('leva para o mapa depois de entrar', async () => {
    vi.stubGlobal(
      'fetch',
      apiFalsa(() => resposta(200, { id: '1', nome: 'lira', email: 'lira@exemplo.test' })),
    );
    montar('entrar');
    await userEvent.type(screen.getByLabelText('E-mail'), 'lira@exemplo.test');
    await userEvent.type(screen.getByLabelText('Senha'), 'senha-forte-1');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));
    expect(await screen.findByText('tela do mapa')).toBeInTheDocument();
  });
});
