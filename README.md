# Hollow Page Pharloom

Um mapa de Pharloom onde cada ponto guarda o que os fãs de Hollow Knight: Silksong fizeram ali: fanarts, mods, textos curtos, vídeos e áudios.

É a continuação da [Hollow Page](https://github.com/tialvesdev/hollow-page), mural de fanarts feito na faculdade. Em vez de um feed, aqui você anda pelo mapa do jogo, entra nas regiões e abre os pontos onde alguém deixou alguma coisa. Explorar rende conquistas, e as conquistas destravam capa, moldura, título e insígnia para o perfil.

## Estado

- [x] Página inicial
- [x] Entrar e criar conta (e-mail e senha, sessão em cookie httpOnly)
- [ ] Mapa de viagem com regiões e pontos
- [ ] Mapa de salas com o vessel andando
- [ ] Publicar os cinco tipos de post
- [ ] Mini feed dos pontos
- [ ] Perfil, conquistas e insígnias

O moodboard com a direção visual fica em [`docs/moodboard`](docs/moodboard).

## Tecnologias

| Parte | Escolhas |
| --- | --- |
| Front (`frontend/`) | React 18, TypeScript, Redux Toolkit (RTK Query), React Router, Vite, Vitest |
| API (`backend/`) | Java 21, Spring Boot 3, Spring Security, JPA, Flyway, PostgreSQL, JWT |
| No ar | Vercel (front), Render (API em Docker), Neon (Postgres) |

## Rodar na sua máquina

Precisa de Node 20+, Java 21, Maven e Docker.

```bash
docker compose up -d          # Postgres em localhost:5432

cd backend
mvn spring-boot:run           # API em http://localhost:8080

cd ../frontend
npm install
npm run dev                   # site em http://localhost:5173
```

No Windows, `backend\run-local.cmd` sobe a API usando o JDK e o Maven de `%USERPROFILE%\tools`.

O Vite repassa `/api` para a API local, então o cookie de sessão fica no mesmo domínio do site.

### Testes

```bash
cd frontend && npm test
cd backend && mvn verify      # usa H2 em modo Postgres, não precisa do Docker
```

## Variáveis da API

| Variável | Para quê | Padrão em dev |
| --- | --- | --- |
| `DB_URL` | JDBC do Postgres | `jdbc:postgresql://localhost:5432/pharloom` |
| `DB_USUARIO`, `DB_SENHA` | acesso ao banco | `pharloom` |
| `JWT_SEGREDO` | assina o token de sessão (32+ caracteres) | um valor fixo só para dev |
| `COOKIE_SEGURO` | cookie só em HTTPS | `false` |
| `CORS_ORIGENS` | sites que podem chamar a API | `http://localhost:5173` |

## Colocar no ar

1. **Banco no Neon.** Crie um projeto (região AWS US East 2, Ohio, perto do Render) e copie host, banco, usuário e senha. A URL para a API fica `jdbc:postgresql://<host>/<banco>?sslmode=require`.
2. **API no Render.** *New › Blueprint* apontando para este repositório. O `render.yaml` cria o serviço `pharloom-api`; preencha `DB_URL`, `DB_USUARIO`, `DB_SENHA` e `CORS_ORIGENS`. O `JWT_SEGREDO` é gerado sozinho.
3. **Site no Vercel.** Importe o repositório com *Root Directory* `frontend`. O `vercel.json` manda `/api` para o Render, então o navegador vê tudo no mesmo domínio e o cookie funciona sem liberar cookie de terceiros.

No plano gratuito do Render a API dorme depois de 15 minutos sem uso; a primeira visita seguinte demora alguns segundos.

## Como contribuir

Branches, commits e padrão de código estão em [CONTRIBUTING.md](CONTRIBUTING.md).

## Créditos

Projeto de fã, sem ligação com a Team Cherry. Hollow Knight e Hollow Knight: Silksong, assim como os mapas e imagens do jogo usados aqui, são da Team Cherry. Os mapas vieram da [Hollow Knight Wiki](https://hollowknight.wiki/w/Areas_(Silksong)).
