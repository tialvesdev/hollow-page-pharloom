import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Ornamento, type IdOrnamento } from './Ornamento';
import './componentes.css';

export function Divisor() {
  return <Ornamento id="carretel" className="divisor" />;
}

type MolduraDeTitulo = Extract<IdOrnamento, 't-agulha' | 't-carretel' | 't-sino' | 't-espinho'>;

type TituloProps = {
  moldura: MolduraDeTitulo;
  /** Moldura de baixo, se for diferente da de cima. */
  baixo?: MolduraDeTitulo;
  children: ReactNode;
  className?: string;
};

/** Título entre duas molduras de Pharloom. */
export function TituloComMoldura({ moldura, baixo, children, className }: TituloProps) {
  return (
    <div className={`titulo-moldura ${className ?? ''}`}>
      <Ornamento id={moldura} />
      {children}
      <Ornamento id={baixo ?? moldura} invertido />
    </div>
  );
}

/** Link de navegação com as setas laterais do menu do jogo. */
export function LinkSeta(props: LinkProps) {
  const { children, className, ...resto } = props;
  return (
    <Link className={`link-seta ${className ?? ''}`} {...resto}>
      <Ornamento id="seta-lateral" />
      {children as ReactNode}
      <Ornamento id="seta-lateral" />
    </Link>
  );
}

type CampoProps = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string;
  erro?: string;
  dica?: string;
};

/** Campo de texto com cantos ornamentados no foco e no erro. */
export function Campo({ rotulo, erro, dica, type = 'text', id, ...resto }: CampoProps) {
  const gerado = useId();
  const idCampo = id ?? gerado;
  const idAjuda = `${idCampo}-ajuda`;
  const [mostrar, setMostrar] = useState(false);
  const ehSenha = type === 'password';
  return (
    <div className={`campo ${erro ? 'campo--erro' : ''}`}>
      <label className="campo__rotulo" htmlFor={idCampo}>
        {rotulo}
      </label>
      <div className="campo__caixa">
        <Ornamento id="canto-de-selecao" className="campo__canto campo__canto--a" />
        <input
          id={idCampo}
          type={ehSenha && mostrar ? 'text' : type}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro || dica ? idAjuda : undefined}
          style={ehSenha ? { paddingRight: 84 } : undefined}
          {...resto}
        />
        {ehSenha && (
          <button
            type="button"
            className="campo__acao"
            onClick={() => setMostrar((m) => !m)}
            aria-pressed={mostrar}
          >
            {mostrar ? 'Esconder' : 'Mostrar'}
          </button>
        )}
        <Ornamento id="selecao-id" className="campo__canto campo__canto--b" />
      </div>
      {erro ? (
        <span className="campo__erro" id={idAjuda}>
          {erro}
        </span>
      ) : dica ? (
        <span className="campo__dica" id={idAjuda}>
          {dica}
        </span>
      ) : null}
    </div>
  );
}

/** Moldura grande, para momentos: entrar, publicar, conquista. */
export function Moldura({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`moldura ${className ?? ''}`}>
      <Ornamento id="canto-superior" className="moldura__canto moldura__canto--tl" />
      <Ornamento id="canto-superior-dir" className="moldura__canto moldura__canto--tr" />
      <Ornamento id="canto-inferior" className="moldura__canto moldura__canto--bl" />
      <Ornamento id="canto-inferior-dir" className="moldura__canto moldura__canto--br" />
      {children}
    </div>
  );
}

/** Moldura do dia a dia: borda fina e duas volutas. */
export function MolduraSimples({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`moldura-simples ${className ?? ''}`}>
      <Ornamento id="k-liso" className="moldura-simples__canto moldura-simples__canto--a" />
      <Ornamento id="k-liso" className="moldura-simples__canto moldura-simples__canto--b" />
      {children}
    </div>
  );
}
