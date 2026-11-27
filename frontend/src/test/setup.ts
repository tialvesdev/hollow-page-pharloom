import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom não tem canvas nem matchMedia; as brasas só precisam não quebrar.
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as never;
window.matchMedia = vi
  .fn()
  .mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });

// O Request do Node não aceita o AbortSignal do jsdom nem URL relativa. Nos testes o RTK Query
// monta Request('/api/...'), então completamos a URL e deixamos o sinal de lado.
const RequestDoNode = globalThis.Request;
globalThis.Request = class extends RequestDoNode {
  constructor(entrada: RequestInfo | URL, opcoes?: RequestInit) {
    const url =
      typeof entrada === 'string' && entrada.startsWith('/')
        ? `http://localhost${entrada}`
        : entrada;
    const semSinal = opcoes ? { ...opcoes, signal: undefined } : opcoes;
    super(url, semSinal);
  }
} as typeof Request;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
