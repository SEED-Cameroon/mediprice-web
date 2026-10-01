# MediPrice Cameroon — Frontend Software Requirements Specification

**Repo:** `mediprice-web` · **Version:** 1.0 · **Audience:** Frontend engineering team
**Companion document:** `mediprice-api`'s Backend SRS (`SRS.md` in that repo) — Section 7 of this document maps every screen to the endpoints it depends on there.

---

## 1. Introduction

### 1.1 Purpose
This document specifies what `mediprice-web` must build: every screen, the interactions and data each one needs, and the cross-cutting behavior (search/filter state, error handling) that ties them together. Visual design is specified separately; this document is about *requirements*, not layout.

### 1.2 Scope
MediPrice is a simple lookup/comparison tool, not a social or account-based product: search a drug/lab/service → see a comparison table across providers with trust badges → done. **No accounts this month.** The only feature that will ever need auth is community price reporting, and that is explicitly out of scope for this cycle — resist adding accounts/dashboards the product doesn't need yet.

### 1.3 Audience
Frontend developers and their lead implementing `mediprice-web`. Backend developers should read Section 7 only, for the API contract this side expects.

### 1.4 Definitions
See the Backend SRS Section 1.4 — Item, Provider, and Trust badge definitions apply here unchanged.

### 1.5 Known documentation gap
This repo's `README.md` currently describes a Supabase/PostgreSQL stack. That is stale/aspirational text — the real backend (`mediprice-api`) is Node.js + Express + MongoDB + JWT, plain REST. Trust the API repo's README and its SRS, not this repo's README, for backend facts. Flag this to the lead to get the README corrected, but don't let it affect any implementation decision below.

---

## 2. System Overview

### 2.1 Tech stack
Vite + React 19, Tailwind CSS v4 (CSS-first, no `tailwind.config.js`), React Router 7, hosted on Vercel. `src/lib/api.js` (`apiFetch`) is the single point of contact with the backend — no component calls `fetch` directly.

### 2.2 No auth this cycle
There is no `AuthProvider`, no protected route, and no login/signup screen in this cycle's scope. Every screen below is public. If community price reporting (Backend SRS FR-7) gets scheduled in a later phase, it will need exactly one auth-gated action (submit a price) — do not build broader account infrastructure in anticipation of it.

### 2.3 Known current gap to fix as part of this build
`apiFetch()` (`src/lib/api.js`) currently throws a generic `API request failed: ${status} ${statusText}` on any non-OK response instead of parsing the backend's `{ success: false, message: "..." }` body. Fix this before building any screen that needs to show a specific error (e.g. "No results found" vs. a real server error) — every backend response is one level deep: `const res = await apiFetch('/medications'); setItems(res.data)`, never `setItems(res)`.

---

## 3. Site Map

| Route | Screen | Built in |
|---|---|---|
| `/` | Landing page | MVP |
| `/medications` | Browse Medications (search + filter) | MVP |
| `/labs-services` | Browse Labs & Services (search + filter) | MVP |
| `/medications/:id`, `/labs-services/:id` | Medication / Service detail (comparison table) | MVP |
| `/compare` | Compare (2+ items side by side) | MVP |
| `/about` | About | MVP |
| `/providers/:id` | Provider detail (a pharmacy/lab's own page) | Phase 2 / Week 4 |
| `*` | 404 | MVP |

No route requires auth. `App.jsx` currently renders only `/` — every other row above still needs its `<Route>` added under the existing `<Layout>` wrapper.

---

## 4. Functional Requirements by screen

### 4.1 Landing page
- Navbar (currently a static header in `Layout.jsx` — needs nav links added: Medications, Labs & Services, About), hero with a prominent search bar (the product's primary entry point — most users should be able to search from the hero, not have to navigate to `/medications` first), and a trust-badge/how-it-works section explaining what SEED-verified / provider-verified / community-reported mean.

### 4.2 Browse Medications
- Search input (debounced, hits `GET /api/medications?q=`), category filter, pagination.
- Three explicit states: loading (skeleton grid), empty (no results — suggest broadening the search, don't just show blank), error (fetch failed — retry action, not a blank screen).
- Each result card shows: name, category, and the *lowest* available price across providers (a teaser — full comparison lives on the detail page) so users get value before clicking through.

### 4.3 Browse Labs & Services
- Same requirements as 4.2, scoped to services, with an additional `type` filter (`lab` vs `care`).

### 4.4 Medication / Service detail
- Full comparison table: one row per provider, columns for provider name/type, price (FCFA, formatted with thousands separator), trust badge (visually distinct per level — this is the product's core trust signal, don't bury it in plain text), and last-updated date.
- Sort the table by price ascending by default.
- A "Compare" checkbox/button per row-item-level action that adds this item to an in-progress comparison selection (state can be local/session, not persisted server-side) and links to `/compare` once 2+ items are selected.
- Handle a non-existent id (404, not a crash) and an item with zero prices yet (explicit "no prices reported yet" state, not an empty table with no explanation).

### 4.5 Compare
- Reads the selected item ids (from query params, e.g. `/compare?type=medication&ids=1,2,3`, so the state survives a page refresh/share) and renders each item's comparison rows side by side.
- Must handle fewer than 2 valid ids (redirect back to browse with a message) and a mix of valid/invalid ids (drop invalid ones silently rather than erroring the whole page).

### 4.6 About
- Static content: what MediPrice is, why it exists, how trust badges work, how pricing data is sourced. No data dependency.

### 4.7 Provider detail *(Phase 2 / Week 4)*
- Provider header (name, type, address/quarter, contact), followed by every item they price, grouped or filterable by medication vs service.

### 4.8 Sort & filter depth *(Phase 2 / Week 4)*
- Category, price range (min/max inputs), and distance sort (requires browser geolocation — handle the permission-denied case gracefully, e.g. hide the distance option rather than erroring) apply across Browse Medications, Browse Labs & Services, and Provider detail.

### 4.9 404
- Friendly not-found message with a link back to `/medications`. No data dependency.

---

## 5. Cross-Cutting Requirements

- **Search/filter state:** keep it in the URL (query params), not only component state — so results are shareable/bookmarkable and survive a refresh. This matters more here than in a typical app because sharing a specific comparison is a plausible real use case ("send this price comparison to a family member").
- **Response handling:** every `apiFetch` caller expects `res.data`, not `res` (Section 2.3). Every list/detail fetch must handle loading/empty/error states explicitly (Section 4.2) — this pattern repeats across nearly every screen, so extract it into a shared hook (e.g. `useApiFetch`) rather than re-implementing it per page.
- **Currency formatting:** centralize FCFA formatting (thousands separator, no decimal places) in one utility — don't hand-format prices per component.

---

## 6. Non-Functional Requirements

- **Responsive:** mobile-first — this product's real users are likely searching from a phone while at a pharmacy counter. Every screen must be usable at ~375px width.
- **Performance:** debounce search input (≥300ms) to avoid firing a request per keystroke; paginate every browse list; lazy-load below-the-fold content on the landing page.
- **Accessibility:** trust badges must not rely on color alone (icon + text label) since they're the product's core trust signal; all interactive elements keyboard-reachable with visible focus states; comparison tables need proper `<th>`/scope markup for screen readers.
- **Browser support:** current evergreen Chrome/Firefox/Safari plus mobile Safari/Chrome.

---

## 7. API Dependency Matrix

Cross-reference with the Backend SRS Section 5 for full endpoint definitions.

| Screen | Depends on |
|---|---|
| Landing page (hero search) | `GET /api/medications` or `GET /api/services` depending on search scope — confirm with backend whether search is unified or split (not yet specified in Backend SRS; flag if a single unified search endpoint is preferred instead) |
| Browse Medications | `GET /api/medications` |
| Browse Labs & Services | `GET /api/services` |
| Medication detail | `GET /api/medications/:id` |
| Service detail | `GET /api/services/:id` |
| Compare | `GET /api/compare` |
| Provider detail | `GET /api/providers/:id` *(Phase 2)* |
| Sort/filter depth | Query params (`sort`, `priceMin`, `priceMax`, `lat`/`lng`) on the above list/detail endpoints *(Phase 2)* |
| Price history (if added to detail page) | `GET /api/medications/:id/history` / `.../services/:id/history` *(Phase 2)* |

**Gap to raise with backend:** the hero search bar on Landing needs to search across *both* medications and services in one call, or the frontend needs to fire two requests and merge results client-side — neither is specified yet in the Backend SRS's endpoint table. Confirm before building Section 4.1.

---

## 8. Phasing

| Phase | Scope |
|---|---|
| **MVP (this cycle)** | Landing, Browse Medications, Browse Labs & Services, Medication/Service detail, Compare, About, 404 |
| **Phase 2 / Week 4** | Provider detail, sort/filter depth (category, price range, distance), price history |
| **Explicitly out of scope this month** | Any accounts/auth/dashboards, including the eventual community price-reporting feature |

## 9. Open Questions / Decisions Needed

1. Unified vs. split search for the Landing page hero (Section 7 gap).
2. Whether Compare's selection state should ever persist beyond the URL (e.g. a "recently compared" list) — not required for MVP, don't build it speculatively.
3. Confirm with backend whether `GET /api/compare` exists yet or whether this screen should temporarily do N parallel detail-endpoint calls as a fallback.
