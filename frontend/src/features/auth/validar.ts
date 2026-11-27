export type Modo = 'entrar' | 'criar';
export type Erros = Partial<Record<'nome' | 'email' | 'senha', string>>;

const NOME_VALIDO = /^[A-Za-z0-9_]{3,24}$/;
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** As mesmas regras da API (AuthDtos.java), para avisar antes de enviar. */
export function validar(modo: Modo, dados: { nome: string; email: string; senha: string }): Erros {
  const erros: Erros = {};
  if (modo === 'criar') {
    if (!dados.nome.trim()) erros.nome = 'Escolha um nome de usuário.';
    else if (!NOME_VALIDO.test(dados.nome.trim()))
      erros.nome = 'Use de 3 a 24 letras, números ou _, sem espaços.';
  }
  if (!dados.email.trim()) erros.email = 'Informe seu e-mail.';
  else if (!EMAIL_VALIDO.test(dados.email.trim())) erros.email = 'Esse e-mail não parece válido.';
  if (!dados.senha) erros.senha = modo === 'criar' ? 'Crie uma senha.' : 'Informe sua senha.';
  else if (modo === 'criar' && (dados.senha.length < 8 || dados.senha.length > 72))
    erros.senha = 'A senha precisa ter de 8 a 72 caracteres.';
  return erros;
}
