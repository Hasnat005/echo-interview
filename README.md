# Echointerview SaaS Starter

Next.js 14 App Router + TypeScript + Tailwind starter with Supabase auth/DB wiring, DeepSeek server helper, Zod, Zustand, and utility helpers.

## Setup

1) Install deps (npm):

```bash
npm install
```

2) Copy environment template:

```bash
cp .env.local.example .env.local
```

Fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `DEEPSEEK_API_KEY`.

3) Run dev server:

```bash
npm run dev
```

Visit http://localhost:3000.

## Project bits

- Supabase clients: `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (RSC/API with cookies/headers).
- DeepSeek server helper: `src/lib/ai/deepseek.ts` (server-only).
- Tailwind class helper: `src/lib/utils.ts` (`cn`).
- Sample Zustand store: `src/store/useAppStore.ts`.
- Sample Zod schema: `src/lib/schemas/example.ts`.

## Scripts

- `npm run dev` — start dev server
- `npm run lint` — lint
- `npm run build` — production build
- `npm start` — run production build
