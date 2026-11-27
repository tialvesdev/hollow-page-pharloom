import { useNavigate } from 'react-router-dom';
import { TituloComMoldura } from '../components/base';
import { Ornamento } from '../components/Ornamento';
import { useSairMutation, useSessaoQuery } from '../features/auth/authApi';
import './mapa.css';

/** Primeira versão da tela logada: o mapa das regiões. Pontos e posts vêm nas próximas etapas. */
export function Mapa() {
  const { data: conta } = useSessaoQuery();
  const [sair, { isLoading }] = useSairMutation();
  const navegar = useNavigate();

  async function sairDaConta() {
    await sair();
    navegar('/', { replace: true });
  }

  return (
    <div className="mapa-pagina">
      <header className="mapa-pagina__topo envelope">
        <span className="mapa-pagina__marca">
          <Ornamento id="agulha" className="mapa-pagina__agulha" />
          Pharloom
        </span>
        <div className="mapa-pagina__conta">
          <span>@{conta?.nome}</span>
          <button type="button" className="bt bt--sec" onClick={sairDaConta} disabled={isLoading}>
            Sair
          </button>
        </div>
      </header>
      <main className="envelope mapa-pagina__miolo">
        <TituloComMoldura moldura="t-carretel">
          <h1 className="mapa-pagina__titulo">Pharloom</h1>
        </TituloComMoldura>
        <div className="mapa-pagina__mapa">
          <img
            src="/img/mapa-regioes.webp"
            alt="Mapa das regiões de Pharloom"
            width={1564}
            height={952}
          />
        </div>
      </main>
    </div>
  );
}
