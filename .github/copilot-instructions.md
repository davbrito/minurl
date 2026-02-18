# Project Guidelines for AI coding agents

## Purpose
Provide focused, actionable instructions for AI agents working on this repo so changes match existing patterns and build/test successfully.

## Code Style
- Language: TypeScript + React (TSX). Follow existing patterns in `src/components/` and `src/routes/*.tsx`.
- Formatting & linting: project uses ESLint (`eslint.config.js`) and TypeScript configs (`tsconfig.json`, `tsconfig.node.json`). Keep changes consistent with those configs.

## Architecture
- Frontend: Vite + React routes in `src/routes.ts` and server/client entries `src/entry.*.tsx`.
- Worker: Cloudflare Worker code under `worker/` and `wrangler.jsonc` for deployment configuration.
- Database: Drizzle ORM configuration in `drizzle.config.ts` and schema in `@core/db/schema.ts`; migrations live in `migrations/`.
- Shortener logic: core URL logic in `src/features/shortener/*` (see `links.ts`, `helpers.ts`).

## Build and Test (commands)
- Install: `pnpm install`
- Dev (local): `pnpm dev` (Vite dev server)
- Build: `pnpm build`
- Run migrations: `pnpm drizzle-kit migrate` (repository uses drizzle migrations)
- Lint: `pnpm lint` (if available)

AI agents will attempt these commands automatically when validating changes.

## Project Conventions (concrete examples)
- Small, focused PRs: keep changes minimal and prefer separate PRs for DB migrations and app code.
- Routes: route components live in `src/routes/` (e.g., `src/routes/minified.tsx`, `src/routes/minified-id.tsx`). Follow existing route patterns.
- Components: prefer small, reusable components under `src/components/` (see `minify-url-form`, `preview`, `created-urls`).
- Database: modify `@core/db/schema.ts` and add a migration in `migrations/` when altering schema. See existing migrations for format.

## Integration Points
- Cloudflare Worker deployment: `wrangler.jsonc` controls the worker build and environment.
- Database: ensure schema changes are accompanied by SQL migrations in `migrations/` and keep `drizzle.config.ts` compatibility in mind.

## Security & Secrets
- Secrets and keys are configured via Cloudflare/Wrangler environment (do not commit secrets). Check `wrangler.jsonc` for environment bindings.
- Avoid leaking any environment secrets into logs or the public bundle. Use the `worker/` session and middleware patterns for auth checks.

## Helpful Files to Inspect
- [eslint.config.js](eslint.config.js)
- [drizzle.config.ts](drizzle.config.ts)
- [wrangler.jsonc](wrangler.jsonc)
- [@core/db/schema.ts](@core/db/schema.ts)
- [src/features/shortener/links.ts](src/features/shortener/links.ts)
- [src/components/minify-url-form/index.tsx](src/components/minify-url-form/index.tsx)
- [src/routes/_internal.tsx](src/routes/_internal.tsx)

## When to Ask for Clarification
- If a change touches DB schema, migrations, or deployment configs, ask before proceeding.
- If a requested pattern is not visible in the repo, ask for the preferred approach.

---
If anything here is unclear or you want narrower rules (tests, CI hooks, or PR templates), tell me which area to expand.
