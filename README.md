# MediPrice Cameroon

Medication, lab test & care price transparency platform. Search a drug, lab test, or service and compare prices across pharmacies, laboratories, and hospitals in Bamenda — every price carries a trust badge (SEED-verified / provider-verified / community-reported) and a last-updated date.

> Full project roadmap: see the MediPrice Internship Guide document.

## Tech stack
- React (Vite) + Tailwind CSS
- Supabase (PostgreSQL, Auth, Row Level Security, Storage)
- Hosting: Vercel + Supabase cloud

## Getting started

```bash
git clone <repo-url>
cd mediprice-cameroon
npm install
cp .env.example .env   # then fill in real values (ask a lead)
npm run dev
```

## Data comes from mediprice-api

Every price, medicine, test and provider on screen is loaded from [mediprice-api](https://github.com/SEED-Cameroon/mediprice-api). Run it first:

```bash
cd ../mediprice-api
npm run seed     # once, to fill an empty database with sample data
npm run dev      # PORT=5001 in its .env
```

Then `npm run dev` here. Vite forwards `/api` to `http://localhost:5001` (see `vite.config.js`), so no `.env` entry or CORS setup is needed locally. To use another backend:

```bash
VITE_API_PROXY=http://localhost:5000   # local backend on a different port (dev/preview proxy)
VITE_API_URL=https://<deployed-api>/api # deployed builds, e.g. on Vercel
```

All requests go through `src/services/catalog.js`, the only file that calls `apiFetch`. If the backend's response shape changes, adjust its `normalise*` functions; no page needs to change.

**Working without a backend:** set `VITE_USE_SAMPLE_DATA=true` to use the bundled sample data in `src/data/`. It is off by default and is left out of normal builds entirely, so the live site can never show sample prices by accident. When it is on, the footer says so.

## Branch & PR rules

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before your first commit. Short version: never push to `main`, branch per feature, small PRs, one review required.

## New intern? Start here

If you're on the One-Month React Track, your daily lessons and tasks live in the [`curriculum`](https://github.com/SEED-Cameroon/curriculum) repo under `onemonth-react-track` — every task this month is built directly in this repo.

## Team

| Role | Name | GitHub |
|------|------|--------|
| Team Lead |  |  |
| Frontend |  |  |
| Backend |  |  |
| UI/UX |  |  |
| QA & Docs |  |  |
