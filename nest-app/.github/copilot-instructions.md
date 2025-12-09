<!-- Copilot instructions for working on the NestJS email API project -->

# Quick Context

This is a small NestJS (v11) TypeScript service organized by feature modules. Primary modules are under `src/` — notably `src/emails`, `src/users`, and `src/database`. Background workers live under `src/emails/workers` and async email sending is implemented via the `emails` module.

**What matters for an AI coding agent:** implement changes inside feature folders, follow existing DTO/entity patterns, and wire modules through `src/*.module.ts` files. Avoid changing global config unless necessary.

## Architecture & Data Flow

- **Controllers → Services → Entities/DB**: Controllers in `src/*/*.controller.ts` accept DTOs (`src/*/dto`) and call services (`src/*/*.service.ts`). Services interact with entities (`src/*/*.entity.ts`) and the `database` module.
- **Background workers**: Worker code is in `src/emails/workers` and helper worker services like `src/emails/email-worker.service.ts` — these perform queued or long-running tasks (email delivery). Keep HTTP handlers fast and push heavy work to workers.
- **Where to add features**: Add a new feature under `src/<feature>/` with `*.module.ts`, `*.controller.ts`, `*.service.ts`, DTOs and entity files. Register the module in `AppModule` or import it from other modules as appropriate.

## Project-specific conventions (discoverable patterns)

- **Files by role**: `*.controller.ts` (HTTP layer), `*.service.ts` (business logic), `*.entity.ts` (DB models), `dto/*.ts` (request/response shapes). Example: `src/emails/emails.controller.ts`, `src/emails/emails.service.ts`, `src/emails/email.entity.ts`, `src/emails/dto/send-email.dto.ts`.
- **Swagger decorators**: APIs use `@nestjs/swagger` annotations in controllers (see `src/emails/emails.controller.ts`). Keep response DTO types consistent with `@ApiResponse.type`.
- **Testing**: Unit tests live with `.spec.ts` files under `src/` and e2e tests are under `test/` (see `test/jest-e2e.json`). Use Jest commands from `package.json`.
- **DB setup**: Database initialization script: `scripts/setup-database.sql`. Database wiring is in `src/database/database.module.ts`.

## Useful commands (from `package.json`)

- Install: `npm install`
- Run development server: `npm run start:dev`
- Run production build: `npm run build` then `npm run start:prod`
- Tests: `npm run test` (unit), `npm run test:e2e` (e2e), `npm run test:cov` (coverage)
- Lint & format: `npm run lint`, `npm run format`

## Examples & How to implement small changes

- To add a new API endpoint that queues an email:
  - Create `src/emails/<feature>.controller.ts` with an endpoint that accepts a DTO from `src/emails/dto`.
  - Add business logic to `src/emails/emails.service.ts` that persists an `Email` entity (`src/emails/email.entity.ts`) and enqueues a job for the worker.
  - Ensure the worker (`src/emails/workers/email.worker.ts`) handles the job and updates entity status (`src/shared/enums/email-status.enum.ts`).

- To update a DTO/Entity contract: change both the DTO in `src/*/dto` and the entity in `src/*/*.entity.ts`; update controllers' `@ApiResponse.type` to match.

## What NOT to change without approval

- Global `tsconfig.json`, `package.json` dependency versions, or Nest CLI config unless you verify compatibility and run tests.
- `scripts/setup-database.sql` contents unless you understand schema implications.

## Files to inspect for context

- `src/emails/emails.controller.ts` — example controller (HTTP + Swagger usage)
- `src/emails/emails.service.ts` — business logic for emails
- `src/emails/workers/email.worker.ts` and `src/emails/email-worker.service.ts` — background processing
- `src/emails/dto/*` and `src/emails/email.entity.ts` — DTO and entity patterns
- `src/database/database.module.ts` — DB wiring and providers
- `test/` and `test/jest-e2e.json` — test layout and e2e config

If anything above is unclear or you want me to include additional examples (e.g., a small change patch or a new endpoint scaffold), tell me which area to expand.
