# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project, using **Bun** workspaces and **Biome** for linting/formatting (part of the `smt` monorepo).

## Get started

1. Install dependencies (from the monorepo root)

   ```bash
   bun install
   ```

2. Start the app

   ```bash
   bun run start:dev
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Other setup steps

- Linting/formatting is handled by [Biome](https://biomejs.dev) via the shared `@tooling/biome` config — run `bun run lint` or `bun run check`.
- Unit tests use Jest (`bun run test`); see `jest.config.js`, `jest.setup.ts`.
- End-to-end tests use Detox (`bun run e2e:test:ios` / `e2e:test:android`); see `.detoxrc.js`.
- Learn more about the TypeScript setup in this template in Expo's guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Desenvolvimento

A API backend roda em `apps/server`. Para testar o mobile contra a API real:

1. Em um terminal, inicie o servidor:
   ```bash
   cd apps/server && bun run start:dev
   ```
   → Deixe rodando enquanto trabalha no mobile (hot reload com tsc-watch).

2. Configure o `.env` do mobile com o IP correto:
   - iOS Simulator → `http://localhost:3000` (padrão)
   - Android Emulator → `http://10.2.2.2:3000`
   - Expo Go (físico) → defina `EXPO_PUBLIC_API_URL=http://192.168.x.x:3000`

3. Teste os endpoints:
   ```bash
   curl http://localhost:3000/categories          # lista de categorias
   curl http://localhost:3000/found-items         # lista de itens (vazia)
   ```

> ⚠️ **Importante:** Sem o servidor rodando, os hooks `useFoundItems` e `useCategories` vão falhar com erro de rede. Mantenha o `start:dev` do server rodando em aba separada o tempo todo.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
