import { Link } from 'react-router-dom';
import { Brasas } from '../components/Brasas';
import { Divisor, LinkSeta, MolduraSimples, TituloComMoldura } from '../components/base';
import { Insignia } from '../components/Insignia';
import { Ornamento } from '../components/Ornamento';
import { useSessaoQuery } from '../features/auth/authApi';
import './inicio.css';

/** Agulhas na prévia do mapa, em porcentagem da imagem. */
const AGULHAS = [
  { x: 16, y: 80, n: 7, nome: 'Bone Bottom' },
  { x: 44, y: 57, n: 3, nome: 'Bellhart' },
  { x: 54, y: 79, n: 4, nome: 'Deep Docks' },
  { x: 72, y: 68, n: 3, nome: 'Far Fields' },
  { x: 39, y: 30, n: 1, nome: 'The Citadel' },
  { x: 79, y: 34, n: 2, nome: 'Bilewater' },
];

const TIPOS = [
  {
    nome: 'Fanart',
    texto: 'Desenho, pintura, pixel art, escultura. O mais comum por aqui.',
    icone: 'arte',
  },
  { nome: 'Mod', texto: 'Link para o mod, com versão e onde baixar.', icone: 'mod' },
  {
    nome: 'Texto',
    texto: 'Uma dica, uma teoria, um desabafo. Curto, como um tweet.',
    icone: 'texto',
  },
  {
    nome: 'Vídeo',
    texto: 'Speedrun, guia ou aquela luta. Link para onde ele está.',
    icone: 'video',
  },
  { nome: 'Áudio', texto: 'Sua versão de uma música do jogo, de até 5 minutos.', icone: 'audio' },
] as const;

function IconeTipo({ tipo }: { tipo: (typeof TIPOS)[number]['icone'] }) {
  const comum = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
  };
  switch (tipo) {
    case 'arte':
      return (
        <svg {...comum} aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="1" />
          <path d="M3 16l5-5 4 4 3-3 6 6" />
        </svg>
      );
    case 'mod':
      return (
        <svg {...comum} aria-hidden="true">
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />
        </svg>
      );
    case 'texto':
      return (
        <svg {...comum} aria-hidden="true">
          <path d="M5 6h14M5 11h14M5 16h9" />
        </svg>
      );
    case 'video':
      return (
        <svg {...comum} aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="M10 9l5 3-5 3z" fill="currentColor" />
        </svg>
      );
    case 'audio':
      return (
        <svg {...comum} aria-hidden="true">
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </svg>
      );
  }
}

export function Inicio() {
  const { data: conta } = useSessaoQuery();

  return (
    <div className="inicio">
      <header className="topo envelope">
        <Link to="/" className="topo__marca">
          <Ornamento id="agulha" className="topo__agulha" />
          Hollow Page <span>Pharloom</span>
        </Link>
        <nav className="topo__acoes" aria-label="Conta">
          {conta ? (
            <Link to="/mapa" className="bt">
              Abrir o mapa
            </Link>
          ) : (
            <>
              <LinkSeta to="/entrar">Entrar</LinkSeta>
              <Link to="/criar-conta" className="bt">
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="abertura">
          <Brasas />
          <div className="abertura__miolo envelope">
            <TituloComMoldura moldura="t-agulha" baixo="t-carretel">
              <h1 className="abertura__titulo">
                <span className="abertura__linha1">Hollow Page</span>
                <span className="abertura__linha2">Pharloom</span>
              </h1>
            </TituloComMoldura>
            <p className="abertura__tese">
              Um mapa do reino onde cada ponto guarda o que os fãs fizeram ali.
            </p>
            <div className="abertura__acoes">
              <Link to={conta ? '/mapa' : '/criar-conta'} className="bt">
                {conta ? 'Abrir o mapa' : 'Criar conta'}
              </Link>
              {!conta && <LinkSeta to="/entrar">Já tenho conta</LinkSeta>}
            </div>
          </div>
        </section>

        <section className="secao envelope" aria-labelledby="t-mapa">
          <div className="secao__duas">
            <div className="secao__texto">
              <h2 id="t-mapa">O mapa é o feed</h2>
              <Divisor />
              <p>
                Em vez de rolar uma lista sem fim, você anda por Pharloom. Cada agulha marca um
                lugar onde alguém deixou alguma coisa.
              </p>
              <ol className="passos">
                <li>
                  <span>
                    <b>Viaje</b> pelo mapa das regiões e veja onde tem movimento.
                  </span>
                </li>
                <li>
                  <span>
                    <b>Entre</b> numa região e ande pelas salas com o seu vessel.
                  </span>
                </li>
                <li>
                  <span>
                    <b>Pare</b> num ponto para abrir o que deixaram ali.
                  </span>
                </li>
              </ol>
            </div>
            <MolduraSimples className="previa-mapa">
              <div className="previa-mapa__imagem">
                <img
                  src="/img/mapa-regioes.webp"
                  alt="Mapa das regiões de Pharloom, com agulhas marcando pontos com posts"
                  width={1564}
                  height={952}
                  loading="lazy"
                />
                {AGULHAS.map((a) => (
                  <span
                    key={a.nome}
                    className="previa-mapa__agulha"
                    style={{ left: `${a.x}%`, top: `${a.y}%` }}
                    aria-hidden="true"
                  >
                    <Ornamento id="agulha" />
                    {a.n > 1 && <span className="previa-mapa__n">{a.n}</span>}
                  </span>
                ))}
              </div>
            </MolduraSimples>
          </div>
        </section>

        <section className="secao envelope" aria-labelledby="t-tipos">
          <h2 id="t-tipos">Cinco jeitos de deixar algo</h2>
          <Divisor />
          <ul className="tipos">
            {TIPOS.map((t) => (
              <li key={t.nome} className="tipo">
                <span className="tipo__icone">
                  <IconeTipo tipo={t.icone} />
                </span>
                <h3>{t.nome}</h3>
                <p>{t.texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="secao envelope" aria-labelledby="t-perfil">
          <div className="secao__duas secao__duas--inverso">
            <div className="cartao-perfil" aria-hidden="true">
              <div className="cartao-perfil__capa">
                <img src="/img/musgo.webp" alt="" loading="lazy" />
              </div>
              <div className="cartao-perfil__retrato">
                <svg viewBox="0 0 48 48">
                  <path
                    d="M17 12 C 15 6, 10 4, 8 7"
                    fill="none"
                    stroke="#F3EEE8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M31 12 C 33 6, 38 4, 40 7"
                    fill="none"
                    stroke="#F3EEE8"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path d="M10 48 C 12 36, 16 32, 24 32 C 32 32, 36 36, 38 48Z" fill="#7a2a2a" />
                  <path d="M24 9 C 35 17, 34 33, 24 33 C 14 33, 13 17, 24 9Z" fill="#F3EEE8" />
                  <ellipse cx="20.3" cy="23" rx="2.4" ry="3.6" fill="#0C0706" />
                  <ellipse cx="27.7" cy="23" rx="2.4" ry="3.6" fill="#0C0706" />
                </svg>
              </div>
              <div className="cartao-perfil__info">
                <span className="cartao-perfil__linha">
                  <b>@lira</b>
                  <Insignia id="musgo" nome="Broto" tamanho={34} />
                </span>
                <span className="cartao-perfil__titulo">Cartógrafa de Bone Bottom</span>
              </div>
              <ul className="conquistas">
                <li className="conquista conquista--feita">
                  <b>Cartógrafa</b>
                  <span>Viu todos os pontos de uma região</span>
                </li>
                <li className="conquista">
                  <b>Fio vermelho</b>
                  <span className="fio">
                    <i style={{ width: '62%' }} />
                  </span>
                  <span>31 de 50 posts da Hornet</span>
                </li>
              </ul>
            </div>
            <div className="secao__texto">
              <h2 id="t-perfil">Explorar rende coisas</h2>
              <Divisor />
              <p>
                Andar pelo mapa, ouvir áudios, dar rosários e publicar contam para conquistas. Cada
                uma destrava algo para o seu perfil: capa, moldura do retrato, título e a insígnia
                que flutua ao lado do seu nome.
              </p>
            </div>
          </div>
        </section>

        <section className="chamada envelope">
          <TituloComMoldura moldura="t-sino">
            <h2 className="chamada__titulo">O reino está esperando</h2>
          </TituloComMoldura>
          <div className="abertura__acoes">
            <Link to={conta ? '/mapa' : '/criar-conta'} className="bt">
              {conta ? 'Abrir o mapa' : 'Criar conta'}
            </Link>
          </div>
        </section>
      </main>

      <footer className="rodape envelope">
        <p>
          Projeto de fã, sem ligação com a Team Cherry. Hollow Knight e Hollow Knight: Silksong são
          da Team Cherry, assim como os mapas e imagens do jogo usados aqui.
        </p>
        <a href="https://github.com/tialvesdev/hollow-page-pharloom">Código no GitHub</a>
      </footer>
    </div>
  );
}
