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

## Sample data vs the live API

With no `VITE_API_URL` set, the app runs entirely on sample data from `src/data/`, so every page works without a backend. To use the real API, add this to your `.env`:

```bash
VITE_API_URL=http://localhost:5000/api   # the mediprice-api base URL
```

All data goes through `src/services/catalog.js`, the only file that calls `apiFetch`. Pages load it with the `useApiFetch` hook, which handles loading and error states. If the backend's field names differ from what the app expects, adjust the `normalise*` functions at the top of `src/services/catalog.js`; no page needs to change.

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
