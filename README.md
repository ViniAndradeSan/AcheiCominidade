# Achei — Achados e Perdidos do Campus

Plataforma para registrar, buscar e devolver itens perdidos no campus. Quem encontra um item cadastra com foto, categoria e local; quem perdeu, procura na lista ou no dashboard web.

**Web (dashboard):** [achei-cominidade.pages.dev](https://achei-cominidade.pages.dev/)
**API:** hospedada no Render
**App:** distribuído como APK (Expo)

---

## O que tem aqui

Três aplicações num monorepo, compartilhando o mesmo backend:

| App | O que é | Stack |
|---|---|---|
| `apps/server` | API REST | NestJS + Prisma + PostgreSQL |
| `apps/mobile` | App para quem acha/procura itens | Expo (React Native) |
| `apps/web` | Dashboard de administração | React + Vite + Tailwind |

**Principais funcionalidades:**
- Cadastro de item achado (foto, título, descrição, categoria, local)
- Localização automática por GPS com preenchimento do endereço (reverse geocoding) e busca de endereço com autocomplete
- Listagem com busca, filtro por categoria e por status (disponível / devolvido)
- Registro de devolução do item
- Upload de imagens via URL pré-assinada (Cloudflare R2)

---

## Como rodar localmente

Pré-requisitos: [Bun](https://bun.sh) e um PostgreSQL rodando (local ou em algum serviço gratuito).

```bash
# instala tudo (raiz do monorepo)
bun install

# configura variáveis de ambiente
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env
# edite o .env do server com sua DATABASE_URL

# aplica o schema e popula categorias iniciais
cd apps/server
bun run db:push
bun run db:seed
cd ../..
```

Depois, em terminais separados:

```bash
# API — http://localhost:3000
cd apps/server && bun run start:dev

# Dashboard web — http://localhost:5173
cd apps/web && bun run dev

# App mobile (Expo)
cd apps/mobile && bun run start
```

> Testando o app mobile num **celular físico**: troque `EXPO_PUBLIC_API_URL` no `.env` pelo IP da sua máquina na rede local — `localhost` só funciona em emulador/simulador.

---

## Gerando o APK

O app mobile é distribuído como APK via [EAS Build](https://docs.expo.dev/build/introduction/):

```bash
cd apps/mobile
eas build -p android --profile preview
```

---

<br>

## Detalhes técnicos

<details>
<summary>Estrutura do monorepo</summary>

Gerenciado com **Turborepo** + workspaces do Bun.

```
apps/
  server/   → API NestJS
  mobile/   → App Expo / React Native
  web/      → Dashboard React + Vite
tooling/    → configs compartilhadas (Biome, TypeScript)
reference/  → schema SQL de referência (documentação do banco)
```

Scripts úteis na raiz (rodam em todos os apps via Turborepo):

```bash
bun run build   # build de produção de todos os apps
bun run lint    # lint (Biome)
bun run check   # lint + format --write
bun run test    # testes de todos os apps
```

</details>

<details>
<summary>Backend (apps/server)</summary>

NestJS + Prisma (adapter `pg`) + PostgreSQL, rodando em Bun.

**Módulos:**
- `found-items` — CRUD de itens achados, com paginação, filtro por status/categoria e busca textual
- `categories` — categorias dos itens
- `item-returns` — registro de devolução
- `geocoding` — proxy para o Nominatim (OpenStreetMap) com throttling e `User-Agent` corretos, usado tanto para busca de endereço (`/geocoding/search`) quanto para localização reversa por coordenadas (`/geocoding/reverse`)
- `storage` — geração de URL pré-assinada para upload direto ao Cloudflare R2

**Scripts principais:**

```bash
bun run start:dev          # dev com reload
bun run db:migrate         # nova migration (dev)
bun run db:deploy          # aplica migrations (prod)
bun run db:studio          # Prisma Studio
bun run test               # testes (bun test)
```

**Variáveis de ambiente** — ver `apps/server/.env.example`. Principais grupos: `DATABASE_URL`, CORS (`WEB_ORIGIN`), JWT, e credenciais do Cloudflare R2 (`R2_*`).

Deploy: Render, usando o `Dockerfile` na raiz do monorepo (o build precisa do contexto completo por causa do pacote de workspace `@tooling/biome`).

</details>

<details>
<summary>Web (apps/web)</summary>

Dashboard administrativo em React 19 + Vite + Tailwind CSS 4, com React Query para os dados e React Router para navegação.

```bash
bun run dev       # http://localhost:5173
bun run build     # gera dist/
bun run deploy    # wrangler pages deploy
```

Variável de ambiente: `VITE_API_URL`, apontando para a API (local ou produção). Deploy: Cloudflare Pages.

</details>

<details>
<summary>Mobile (apps/mobile)</summary>

Expo SDK 57 + Expo Router + React Query, com persistência de cache (`AsyncStorage`) e Reanimated para animações.

```bash
bun run start      # abre o Metro / Expo Dev Tools
bun run android     # abre no emulador/dispositivo Android
bun run ios         # abre no simulador iOS
bun run test        # Jest
```

Variável de ambiente: `EXPO_PUBLIC_API_URL`. Sem ela definida, o app tenta detectar automaticamente (`10.0.2.2` no emulador Android, `localhost` no resto) — em dispositivo físico é obrigatório definir manualmente.

Distribuição via EAS Build gerando APK (ver seção "Gerando o APK" acima).

</details>

<details>
<summary>Banco de dados</summary>

PostgreSQL. O schema fonte de verdade é o `schema.prisma` do backend; `reference/schema_achei_postgresql.sql` é uma referência em SQL puro para consulta/documentação.

**Tabelas principais:** `item_categories`, `found_items` (com índices para status, categoria e busca textual) e `item_returns`.

</details>

<details>
<summary>Qualidade de código</summary>

- **Biome** para lint e formatação em todos os apps (configuração compartilhada em `tooling/biome`)
- Testes: `bun test` no backend, `Jest` + `@testing-library/react-native` no mobile
- TypeScript em todo o projeto (`tooling/typescript` com configs base compartilhadas)

</details>
