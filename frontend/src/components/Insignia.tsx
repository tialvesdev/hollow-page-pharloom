import './insignia.css';

/** Insígnias que a pessoa destrava e usa ao lado do nome. Desenhos provisórios. */
const DESENHOS = {
  musgo: (
    <>
      <circle cx="24" cy="24" r="21" fill="#102817" stroke="#8CC06F" strokeWidth="1.8" />
      <path d="M8 34 Q24 28 40 34 L40 38 Q24 32 8 38Z" fill="#376742" />
      <path
        d="M24 34 C 24 26, 23 20, 24 14"
        fill="none"
        stroke="#8CC06F"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M24 22 C 16 22, 13 15, 14 11 C 20 11, 24 15, 24 22Z" fill="#8CC06F" />
      <path d="M24 18 C 31 18, 35 12, 34 8 C 28 8, 24 12, 24 18Z" fill="#b6e094" />
    </>
  ),
  agulha: (
    <>
      <path d="M24 2 L45 24 L24 46 L3 24Z" fill="#3a1416" stroke="#F3EEE8" strokeWidth="1.6" />
      <path d="M24 8 L39 24 L24 40 L9 24Z" fill="#5a1d20" />
      <path d="M13 36 L33 11 Q35.5 8.5 34.6 12 L15 37Z" fill="#F3EEE8" />
      <path
        d="M33.5 12 C 40 16, 30 24, 24 21 S 14 26, 18 32"
        fill="none"
        stroke="#E8636A"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </>
  ),
} as const;

export type IdInsignia = keyof typeof DESENHOS;

export function Insignia({
  id,
  nome,
  tamanho = 40,
}: {
  id: IdInsignia;
  nome: string;
  tamanho?: number;
}) {
  return (
    <span className="insignia" style={{ width: tamanho, height: tamanho }} title={nome}>
      <svg viewBox="0 0 48 48" role="img" aria-label={`Insígnia ${nome}`}>
        {DESENHOS[id]}
      </svg>
    </span>
  );
}
