import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { lerErro } from '../app/api';
import { Brasas } from '../components/Brasas';
import { Campo, Divisor, LinkSeta, Moldura } from '../components/base';
import { useCadastrarMutation, useEntrarMutation, useSessaoQuery } from '../features/auth/authApi';
import { validar, type Erros, type Modo } from '../features/auth/validar';
import './acesso.css';

export function Acesso({ modo }: { modo: Modo }) {
  const { data: conta } = useSessaoQuery();
  const [entrar, estadoEntrar] = useEntrarMutation();
  const [cadastrar, estadoCadastrar] = useCadastrarMutation();
  const navegar = useNavigate();
  const local = useLocation();
  const voltarPara = (local.state as { voltarPara?: string } | null)?.voltarPara ?? '/mapa';

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState('');

  const criando = modo === 'criar';
  const enviando = estadoEntrar.isLoading || estadoCadastrar.isLoading;

  if (conta) return <Navigate to={voltarPara} replace />;

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErroGeral('');
    const achados = validar(modo, { nome, email, senha });
    setErros(achados);
    if (Object.keys(achados).length) return;
    try {
      if (criando) await cadastrar({ nome: nome.trim(), email: email.trim(), senha }).unwrap();
      else await entrar({ email: email.trim(), senha }).unwrap();
      navegar(voltarPara, { replace: true });
    } catch (falha) {
      const { mensagem, campos } = lerErro(falha);
      setErros(campos);
      setErroGeral(Object.keys(campos).length ? '' : mensagem);
    }
  }

  return (
    <div className={`acesso acesso--${modo}`}>
      <div className="acesso__fundo" aria-hidden="true" />
      <Brasas quantidade={50} />
      <header className="acesso__topo envelope">
        <LinkSeta to="/">Voltar ao início</LinkSeta>
      </header>
      <main className="acesso__palco envelope">
        <Moldura className="acesso__painel">
          <form className="acesso__form" onSubmit={enviar} noValidate>
            <div className="acesso__cabeca">
              <span className="acesso__rotulo">Hollow Page Pharloom</span>
              <h1>{criando ? 'Criar conta' : 'Entrar'}</h1>
              <Divisor />
              <p>
                {criando
                  ? 'Um nome, um e-mail e uma senha. O resto você monta depois, explorando.'
                  : 'Bem-vindo de volta. Seu vessel está no último banco em que sentou.'}
              </p>
            </div>

            {erroGeral && (
              <p className="aviso-erro" role="alert">
                {erroGeral}
              </p>
            )}

            {criando && (
              <Campo
                rotulo="Nome de usuário"
                name="nome"
                autoComplete="username"
                placeholder="lira"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                erro={erros.nome}
                dica="É como você aparece no mapa. Letras, números e _."
                maxLength={24}
              />
            )}
            <Campo
              rotulo="E-mail"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="voce@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              erro={erros.email}
            />
            <Campo
              rotulo="Senha"
              name="senha"
              type="password"
              autoComplete={criando ? 'new-password' : 'current-password'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              erro={erros.senha}
              dica={criando ? 'Pelo menos 8 caracteres.' : undefined}
            />

            <button type="submit" className="bt bt--largo" disabled={enviando}>
              {enviando
                ? criando
                  ? 'Criando conta…'
                  : 'Entrando…'
                : criando
                  ? 'Criar conta'
                  : 'Entrar'}
            </button>

            <p className="acesso__troca">
              {criando ? 'Já tem conta? ' : 'Ainda não tem conta? '}
              <Link to={criando ? '/entrar' : '/criar-conta'} state={local.state}>
                {criando ? 'Entrar' : 'Criar conta'}
              </Link>
            </p>
          </form>
        </Moldura>
      </main>
    </div>
  );
}
