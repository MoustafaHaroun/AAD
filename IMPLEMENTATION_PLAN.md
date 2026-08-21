# Trade² — Figma-to-code implementation plan

## Context

The Figma file "Trade²" (`ro8v0SCuSsKYBa5eFJlWV6`) contains ~20 high-fidelity mockups for a Dutch skill-bartering marketplace app aimed partly at elderly users (accessibility is a first-class concern per the project's own requirements docs). The frontend (`frontend/`, Expo/React Native, Clean Architecture) and backend (`backend/`, NestJS/TypeORM/Postgres/MinIO) already implement a meaningful subset of this app — auth, a listings CRUD flow, favorites, messages, notifications — but several mockup screens (Home, bottom nav, Chat, multi-step registration with avatar, category/type on listings) don't exist yet, and a few backend gaps block them outright (see below). The goal is to bring the app fully in line with the mockups, screen by screen, while reusing the existing architecture and conventions exactly, and to give a clean, reviewable list of every backend change before any of it is built.

This plan was built by: pulling the full Figma screen inventory + `get_design_context`/screenshot for the Home screen (giving exact colors/spacing/type), exploring the frontend and backend codebases in depth, reading the project's own LaTeX requirements docs, and verifying (by reading the actual source) the key factual claims that shape scope — in particular, two real bugs/gaps that block mockup screens outright:

1. **`MessageRepository.findAllBySenderId`** (`backend/src/infrastructure/persistence/typeorm/repositories/message.repository.ts:24-29`) only returns messages the caller *sent*, never received — confirmed by reading the file. A Chat screen is impossible without fixing this.
2. **`ImageService.pickImageFromGallery`** (`frontend/src/infrastructure/services/image.service.ts:31-37`) is an unfinished stub — requests permissions then returns nothing. Confirmed by reading the file. Blocks the "Register pfp" and any gallery-based image picking.
3. **`token-store.ts`** (`frontend/src/infrastructure/api/token-store.ts`) is a plain in-memory class — confirmed by reading the file — so the session is lost on every app restart.

Decisions already made with the user (do not re-litigate these during implementation):
- **Categories**: fixed backend enum on `Listing` (10 values, see B1).
- **Heart icon** = favorite/bookmark only, using the existing `Favorite` entity as-is. No backend change.
- **Listing type**: add `type: 'offer' | 'request'` to `Listing` now, even though the mockups don't visually distinguish it yet.
- **Chat**: build against the existing REST `/messages` endpoints (React Query polling), explicitly no WebSocket.
- **Avatar**: add `avatar` to `User` + a MinIO-backed upload endpoint, reusing the listing-attachments pattern.
- **"Express interest" (FR6)**: a "Trade Request" action on the listing detail screen that starts a chat (creates the first `Message`) and relies on the notification `CreateMessageUseCase` already fires — no new entity.
- **Session persistence**: migrate `token-store.ts` to `expo-secure-store`.

## Open questions / assumptions (flag before/while implementing — do not silently resolve)

1. **Category enum values** (not yet confirmed by the user): `MOVING`, `COOKING`, `GARDENING`, `CARPENTRY`, `CHILDCARE`, `CLEANING`, `TUTORING`, `TECH_HELP`, `PET_CARE`, `OTHER`. Derived from mockup titles + reasonable headroom — adjust freely, just keep it a closed set.
2. **Chat threading**: no `listingId`/thread entity — group messages client-side by counterpart user id (matches the mockup's per-person Chats list). A "regarding: `<listing>`" reference is a nice-to-have, not built.
3. **Message read/unread**: not built (not visible in the sampled mockup node); flag if the actual Chats mockup shows unread badges once inspected.
4. **Profile (110:528) vs Profile (107:242)**: not disambiguated yet — Phase 6 must pull `get_design_context` on both before deciding which is "view" vs "edit/settings".
5. **Noto Sans**: not currently a dependency. Plan adds `@expo-google-fonts/noto-sans` + `expo-font` — confirm this is wanted before adding (given elderly-user accessibility focus in the docs, recommended).
6. **Multi-step registration**: implemented as ONE route (`/register`) with an internal step wizard (shared `react-hook-form` instance, per-step validation) rather than one Expo route per Figma frame — deviates from the "one screen per node" default elsewhere in this plan, done to avoid passing a plaintext password across routes.
7. **My Listings filtering**: no backend `GET /listings?userId=` route exists. Plan filters client-side from the already-fetched listings cache (`listing.user?.id === currentUserId`) rather than adding a backend query param — zero new backend surface.
8. Pre-existing dead code found and intentionally NOT touched: a parallel local-first Drizzle `Listing` repository/schema (`frontend/src/infrastructure/persistence/repositories/listing.repository.ts`) that nothing currently uses (the real listings screen uses the API-backed `ApiListing` stack). Flagged for awareness, out of scope here.

## Consolidated backend changes (for review before implementation starts)

| # | Area | What | Files (backend/) | Migration |
|---|------|------|-------------------|-----------|
| B1 | Listing category + type | Add `category` enum (10 values) and `type: offer\|request` enum columns to `listings`; thread through DTOs/schema/repo/usecases/public DTO; add optional `category`/`type` query filters to `GET /listings` | `src/domain/enums/listing-category.enum.ts` (new), `src/domain/enums/listing-type.enum.ts` (new), `src/domain/entities/listing.entity.ts`, `src/infrastructure/persistence/typeorm/models/listing.model.ts`, `src/application/schemas/listing.schema.ts`, `src/application/dto/listings/{create-listing,public-listing,update-listing,get-listings}.dto.ts`, `src/infrastructure/persistence/typeorm/repositories/listing.repository.ts`, `src/application/usecases/listings/{get,create,patch}/*.usecase.ts` (+ their `.spec.ts`) | Yes — `AddCategoryAndTypeToListings` |
| B2 | User avatar | Add nullable `avatar` column to `users`; new MinIO-backed `POST /users/:id/avatar` (self-or-admin, reuses the listing-attachment upload pattern) and `DELETE /users/:id/avatar` | `src/domain/entities/user.entity.ts`, `src/infrastructure/persistence/typeorm/models/user.model.ts`, `src/application/dto/users/add-avatar-to-user.dto.ts` (new), `src/application/usecases/users/avatar/{add,remove}-avatar-from-user.usecase.ts` (new), `src/presentation/controllers/user.controller.ts`, `src/presentation/modules/user.module.ts` | Yes — `AddAvatarToUsers` |
| B3 | Message fix + ordering | **Bug fix**: `findAllBySenderId` only returns sent messages — replace with a query that returns messages where the user is sender OR recipient, ordered by a new `createdAt` column (currently missing entirely) | `src/infrastructure/persistence/typeorm/models/message.model.ts`, `src/domain/entities/message.entity.ts`, `src/infrastructure/persistence/typeorm/repositories/message.repository.ts`, `src/application/usecases/messages/get/get-messages-by-user-id.usecase.ts` (+ specs) | Yes — `AddCreatedAtToMessages` |
| B4 | Favorites | None — heart icon reuses `Favorite` as-is, already fully implemented both sides | — | No |

All migrations follow the existing numeric-timestamp naming convention (`backend/src/database/migrations/1743897600000-InitialSchema.ts`, `...0001-AddLocationToUsers.ts`). Run `npm run migration:generate` (or hand-verify), `npm run test`, and `npm run swagger:generate` (refreshes the checked-in `backend/swagger.json`) after each.

## Figma screen inventory (file `ro8v0SCuSsKYBa5eFJlWV6`)

Confirmed brand tokens from Home's `get_design_context` (use these, don't invent colors): primary/header `#F7DF6E`, CTA gradient `#FCC010`→`#F28D1B`, secondary-tile bg `#EBE0AD` (`primdesat`), secondary text `#38362E` (`forehued`), card content bg `#EDEBE3` (`surfhued`), text `#1B1B1B`/white, 10px radius, Noto Sans (Medium/SemiBold/Bold/Black).

| Screen | Node | Phase |
|---|---|---|
| Landing | 113:1076 | 1 |
| Login | 113:1183 | 1 |
| Register (credentials/names/address/pfp) | 113:1248 / 113:1323 / 113:1357 / 113:1285 | 1 & 3 |
| Home | 56:784 | 2 |
| Listings, Listings-list | 103:197, 247:980 | 2 |
| Listing, Listing-kinderopas | 56:921, 184:182 | 2 |
| Create listing | 183:981 | 3 |
| Edit listing | 183:1043, 215:253 | 3 |
| Liked Listings (+ list) | 274:494, 274:690 | 4 |
| My Listings (+ list) | 274:612, 274:751 | 4 |
| Chat, Chats | 73:1048, 103:11 | 5 |
| Profile ×2 | 110:528, 107:242 | 6 |

(Branding/Logo/Desktop/Listings-device nodes are not in scope — unused/reference-only.)

## Phase 0 — Foundations (tokens, deps, bug fixes)

No user-visible screens; everything else depends on this.

- Add Trade² palette as new tokens: **edit** `frontend/src/presentation/styles/theme.ts` (new keys `prim`, `sec`, `primdesat`, `forehued`, `surfhued`, `primary` → `#F7DF6E`-derived), **edit** `frontend/src/presentation/styles/global.css` (mirrored CSS vars), **edit** `frontend/tailwind.config.js` (extend `theme.extend.colors`).
- **Edit** `frontend/src/presentation/styles/screen-options.ts` — replace the hardcoded `"#F7DF6E"` with the new token.
- **New** `frontend/src/presentation/components/containers/bottom-nav.tsx` — persistent 4-tab bar (Home/Listings/Chats/Account), custom-built (not `expo-router`'s `<Tabs>`) to match the mockup's exact visuals; active tab bold black, inactive `forehued`.
- **Fix** `frontend/src/infrastructure/services/image.service.ts:31-37` — implement `pickImageFromGallery` using `launchImageLibraryAsync` (mirror the working `takePhoto`). Blocks Phase 1/3/6 avatar work otherwise.
- **Edit** `frontend/src/presentation/components/containers/layout.tsx` — add font loading (if Noto Sans approved) behind the existing `Suspense`/migrations gate.
- New deps: `npx expo install expo-secure-store expo-linear-gradient @expo-google-fonts/noto-sans expo-font` (none currently present — confirmed via `package.json` grep).

**Verify**: `npm run lint:format && npm run lint:check`; `npx expo start -c` boots and existing Login/Listings screens still render correctly.

## Phase 1 — Auth persistence + registration wizard

- **Edit** `frontend/src/infrastructure/api/token-store.ts` — add async `hydrate()` reading from `SecureStore.getItemAsync`, keep `get()`/`getPayload()`/`getUserId()` synchronous against an in-memory mirror (every existing call site calls these synchronously — must not become async), `set()`/`clear()` fire-and-forget to SecureStore.
- **Edit** `frontend/src/presentation/components/containers/layout.tsx` — `await tokenStore.hydrate()` behind a loading gate before rendering `<Stack />`, so route guards never see a stale logged-out state on cold start.
- **New** `frontend/src/presentation/screens/landing.screen.tsx` + `frontend/src/app/index.tsx` (Landing, node 113:1076).
- **Rewrite** `frontend/src/presentation/screens/register.screen.tsx` as an internal 4-step wizard (credentials → names → address → pfp) sharing one `react-hook-form` instance with per-step `zod` validation (`trigger([...])` before advancing); pfp step uses the now-fixed `pickImageFromGallery` to preview locally; final submit calls `useCreateUser()`, then (Phase 3's) avatar upload.
- Reuse as-is: `login.screen.tsx` (only re-themed), `form-field.tsx`, existing `useCreateUser`/`useSignIn`.

**Verify**: register through all 4 steps against a running backend (`docker-compose up` in `backend/`), sign in, **force-quit and relaunch the app** to prove the session survives restart (the actual point of this phase — Fast Refresh alone won't prove it).

## Phase 2 — Bottom nav shell, Home, Listings, Listing detail

- **New** `frontend/src/app/(tabs)/_layout.tsx` — route group wrapping Home/Listings/Chats/Account with `bottom-nav.tsx`.
- **New** `frontend/src/app/(tabs)/index.tsx` → **new** `frontend/src/presentation/screens/home.screen.tsx` (search bar, 4 quick-action tiles, Chats preview strip, "New Listings" 2×2 grid).
- **Move** `frontend/src/app/(listings)/index.tsx` + `listings.screen.tsx` → `frontend/src/app/(tabs)/listings/index.tsx`, add search + category/type filter row (`listing-filters.tsx`, new).
- **New** stub routes `frontend/src/app/(tabs)/{chats,account}/index.tsx` (filled in Phases 5/6).
- **Edit** `frontend/src/presentation/components/domain/items/listing-item.tsx` — add category/type badge, and an inline favorite-heart toggle (mockup cards show the heart directly on the card; today only the detail screen has one) backed by `useGetFavorites()` so cards show correct state without a per-card fetch.
- **Edit** `frontend/src/domain/entities/api-listing.entity.ts`, `.../infrastructure/persistence/repositories/api-listing.http-repository.ts`, `.../application/usecases/get-api-listings.usecase.ts`, `.../presentation/hooks/queries/get-api-listings.hook.ts` — add `category`/`type` fields and optional `{ q, category, type }` filter params (query key must include the params).
- **New** `frontend/src/presentation/components/domain/home/quick-action-tile.tsx` (uses `expo-linear-gradient` for the "New listing" CTA tile).
- Depends on B1 landing for full fidelity (category/type badges); can start structurally without it.

**Verify**: Home renders tiles/grid, tapping a card navigates to detail, Listings search/filter actually narrows results (check the network call includes `q`/`category`/`type`), bottom nav active-state correct on all 4 routes, favoriting stays in sync between card and detail view.

## Phase 3 — Create/Edit listing (category+type UI) + avatar (B1 + B2)

**Blocked on B1 + B2 backend changes being reviewed, migrated, and verified (`npm run test`, manual Swagger check) first.**

- **Edit** `create-listing.screen.tsx` / `edit-listing.screen.tsx` — add category picker + offer/request segmented control (new `frontend/src/presentation/components/primitives/segmented-control.tsx` if reused in 2+ places).
- **Edit** `frontend/src/domain/repositories/user.irepository.ts`, `.../infrastructure/persistence/repositories/user.http-repository.ts` — add `uploadAvatar`/`removeAvatar` (mirrors `ApiListingHttpRepository.uploadAttachment`).
- **New** `frontend/src/application/usecases/upload-user-avatar.usecase.ts`, `frontend/src/presentation/hooks/mutations/upload-user-avatar.hook.ts`.
- **Edit** `register.screen.tsx` (Phase 1) — wire the pfp step's local URI to this mutation after `createUser` succeeds.

**Verify**: backend `npm run test` + manual Swagger UI check of `POST /listings` and `POST /users/:id/avatar`; frontend — create a listing with each category/type, confirm round-trip; complete registration through pfp, confirm avatar appears (check MinIO console at `localhost:9001`, and Android emulator resolution via `10.0.2.2:9000` if testing on-device).

## Phase 4 — Favorites (Liked Listings / My Listings)

Pure frontend, backend already complete (B4 = no change).

- **New** `frontend/src/presentation/screens/liked-listings.screen.tsx` and `my-listings.screen.tsx` (+ routes under `(tabs)/account/`), both reusing `ListingItem` in the same 2-column grid, filtered client-side from the already-fetched listings cache: Liked = cross-referenced against `useGetFavorites()`, My = `listing.user?.id === currentUserId` (no backend query param needed — see open question 7).

**Verify**: favorite listings from Home/Listings, confirm they appear in Liked Listings; create listings, confirm they appear only in My Listings.

## Phase 5 — Chat / messaging + Trade Request

**Hard-blocked on B3** (the `findAllBySenderId` bug fix) — no two-sided conversation is possible without it.

- **Edit** `frontend/src/domain/entities/message.entity.ts` — widen `Message` to `{ id, content, createdAt, sender, recipient }` (currently thin `{ id, content, recipientId }`).
- **Edit** `message.http-repository.ts` response mapping.
- **New** `chats.screen.tsx` (conversation list, grouped client-side by counterpart id — open question 2) and `chat.screen.tsx` (single thread, input bar, `useCreateMessage` to send, `refetchInterval` polling — no WebSocket), plus routes `(tabs)/chats/index.tsx` and `(tabs)/chats/[userId]/index.tsx`.
- **New** `message-bubble.tsx` (sender-aligned).
- **Edit** `listing.screen.tsx` — reframe the existing "Send message" button (already ~80% of this feature) as "Trade Request", and on success `router.push` into the new conversation instead of doing nothing.
- **Edit** the Home screen's Chats preview strip to use real conversation data instead of a placeholder.

**Verify**: backend — two seeded users messaging each other, confirm both see the full thread via `GET /messages`; frontend — two-session manual test (emulator + `npm run web`) sending messages back and forth, confirm polling picks them up, and "Trade Request" from a listing lands you in that conversation.

## Phase 6 — Profile / Account

- Pull `get_design_context` on both Profile nodes (110:528, 107:242) first to resolve open question 4.
- **New** `profile.screen.tsx` (view) and `account-settings.screen.tsx` (edit form + avatar re-upload + **logout**: `tokenStore.clear()` + redirect — first real trigger of the Phase 1 SecureStore `clear()` path).
- Reuse existing `get-user.hook.ts`, `update-user.hook.ts`, `form-field.tsx` — no new backend support needed beyond B2.

**Verify**: edit profile fields and avatar, confirm persistence across navigation; log out, then **relaunch the app** and confirm the session does NOT auto-restore (proves `clear()` reached SecureStore, not just memory).

## Sequencing

```
Phase 0 → Phase 1 → Phase 2 (needs B1 for full fidelity)
                          ↓
                     Phase 3 (B1 + B2 backend, reviewed first)
                          ↓
              Phase 4 ─────────── Phase 5 (needs B3 backend, reviewed first)
                          ↓
                     Phase 6 (needs Phase 3 avatar + Phase 1 logout)
```

B1/B2/B3 backend changes should each be reviewed and merged as their own change before their dependent frontend phase (3 for B1/B2, 5 for B3) begins.

## General verification approach (no automated frontend test suite exists)

- Every step: `npm run lint:check` (frontend, 4-space/double-quote/semicolon stylistic rules — no Prettier) — fix with `npm run lint:format`.
- Backend: `npm run test` for new/changed usecases (Jest specs already exist for this codebase — follow the existing `*.usecase.spec.ts` pattern), `npm run swagger:generate` after any DTO/schema change.
- Manual, end-to-end against a real backend (`docker-compose up` in `backend/`) is the primary verification method throughout, since there's no frontend test runner — each phase above lists its specific manual check.
