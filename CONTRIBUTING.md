# Como trabalhar neste repositório

## Branches

- `main` é o que está no ar. Ninguém dá push direto nela.
- Todo trabalho sai de uma branch nova, criada a partir da `main`, e volta por pull request.
- Nome da branch: `tipo/assunto-curto`, em português e com hífens.
  - `feat/landing-e-login`
  - `fix/cookie-em-producao`
  - `docs/moodboard-mapas`
  - `chore/ci-cache`

## Commits

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/pt-br/), com a descrição em português, no imperativo e sem ponto final.

```
tipo(escopo): descrição curta
```

| Tipo | Quando usar |
| --- | --- |
| `feat` | algo novo para quem usa o site |
| `fix` | correção de bug |
| `refactor` | muda o código sem mudar o comportamento |
| `style` | só formatação |
| `test` | testes |
| `docs` | documentação e moodboard |
| `chore` | build, dependências, CI, deploy |

Escopos: `web` (frontend), `api` (backend), `infra` (CI e deploy), `design` (moodboard e ornamentos).

Exemplos:

```
feat(web): tela de entrar com moldura e cantos nos campos
fix(api): devolver 401 quando o token expira
chore(infra): blueprint do Render para a API
```

Um commit faz uma coisa. Se a descrição precisa de "e", provavelmente são dois.

## Pull requests

- Título no mesmo formato do commit.
- O CI precisa passar: formatação, lint, testes e build do front; `mvn verify` da API.
- Mudou interface? Coloque print de antes e depois.
- Merge por squash, para a `main` ficar com um commit por PR.

## Padrão de código

### Front (`frontend/`)

- React 18 + TypeScript estrito + Redux Toolkit. Chamadas à API só pelo RTK Query (`src/app/api.ts`), cada área injeta as suas rotas.
- Nomes em português: componentes em PascalCase (`Moldura`), funções e variáveis em camelCase (`lerErro`).
- Pastas: `app/` (store e API), `features/<área>/` (lógica e rotas de cada área), `components/` (peças visuais reaproveitáveis), `pages/` (telas), `styles/` (tokens e base).
- CSS puro, um arquivo por tela ou grupo de componentes, classes no formato `bloco__parte--variação`. Cores e fontes sempre pelos tokens de `styles/tokens.css`.
- Ornamentos vêm do sprite `public/ornamentos.svg`. Para mudar ou criar um, edite `docs/moodboard/tools/orn.py` e rode `python docs/moodboard/tools/sprite.py`.
- Prettier e ESLint decidem a formatação: `npm run format` e `npm run lint`.

### API (`backend/`)

- Spring Boot 3, Java 21, Maven. Pacotes por área (`auth`, `usuario`), não por camada.
- Nomes de classes e métodos em português (`AuthService.cadastrar`), anotações e tipos do Spring como são.
- Mudança no banco sempre por migração nova do Flyway em `src/main/resources/db/migration` (`V2__descricao.sql`). Nunca edite uma migração que já subiu.
- Erros esperados saem como `ErroDeNegocio`; a resposta tem sempre `{ mensagem, campos }`, com texto pronto para mostrar a quem usa.
- Cada rota nova ganha teste em `src/test` (MockMvc, banco H2 em modo Postgres).

## Textos da interface

- Português do Brasil, frases curtas, falando com a pessoa.
- Botão diz o que acontece ("Criar conta", não "Enviar").
- Erro diz o que houve e como resolver.
- Sem travessão, sem selos que só repetem o que a tela já mostra.
