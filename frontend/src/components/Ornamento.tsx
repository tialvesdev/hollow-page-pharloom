import type { CSSProperties } from 'react';

/** Ids dos símbolos em /ornamentos.svg (gerado por docs/moodboard/tools/sprite.py). */
export type IdOrnamento =
  | 't-agulha'
  | 't-carretel'
  | 't-sino'
  | 't-espinho'
  | 'k-liso'
  | 'k-espinho'
  | 'k-fio'
  | 'canto-superior'
  | 'canto-superior-dir'
  | 'canto-inferior'
  | 'canto-inferior-dir'
  | 'canto-de-selecao'
  | 'selecao-id'
  | 'seta-lateral'
  | 'carretel'
  | 'agulha';

const CAIXAS: Record<IdOrnamento, string> = {
  't-agulha': '0 0 600 120',
  't-carretel': '0 0 600 120',
  't-sino': '0 0 600 120',
  't-espinho': '0 0 600 120',
  'k-liso': '0 0 120 120',
  'k-espinho': '0 0 120 120',
  'k-fio': '0 0 120 120',
  'canto-superior': '0 0 230 185',
  'canto-superior-dir': '0 0 230 185',
  'canto-inferior': '0 0 230 190',
  'canto-inferior-dir': '0 0 230 190',
  'canto-de-selecao': '0 0 52 52',
  'selecao-id': '0 0 52 52',
  'seta-lateral': '0 0 80 145',
  carretel: '0 0 420 28',
  agulha: '0 0 30 52',
};

type Props = {
  id: IdOrnamento;
  className?: string;
  style?: CSSProperties;
  /** Espelha na vertical, para usar a mesma moldura embaixo do título. */
  invertido?: boolean;
};

/** Ornamento decorativo em osso. Fica fora da árvore de acessibilidade. */
export function Ornamento({ id, className, style, invertido }: Props) {
  return (
    <svg
      className={className}
      viewBox={CAIXAS[id]}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      style={invertido ? { ...style, transform: 'scaleY(-1)' } : style}
    >
      <use href={`/ornamentos.svg#${id}`} />
    </svg>
  );
}
