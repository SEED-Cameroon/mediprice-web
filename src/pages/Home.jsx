import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    navigate(`/medications?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* HERO */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">

          <div className="max-w-3xl">
            <span className="inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              MediPrice Cameroon
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Find and compare
              <span className="text-emerald-600"> healthcare prices </span>
              in Cameroon.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Compare medication, laboratory test, and care prices from
              different providers so you can make better healthcare decisions.
            </p>

            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a medication or service..."
                className="flex-1 rounded-xl border border-slate-300 bg-white px-5 py-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />

              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-7 py-4 font-semibold text-white transition hover:bg-emerald-700"
              >
                Search
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/medications"
                className="rounded-lg border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
              >
                Browse Medications
              </Link>

              <Link
                to="/labs-services"
                className="rounded-lg border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50"
              >
                Labs & Services
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* WHY MEDIPRICE */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Healthcare price comparison made simple
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Search for what you need, compare prices from different
              providers, and choose the option that works best for you.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* CARD 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                🔎
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Search
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Search for medications, laboratory tests, and healthcare
                services available in your area.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                ⚖️
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Compare
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                See prices from different providers and compare them in one
                place.
              </p>
            </div>

            {/* CARD 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                🛡️
              </div>

              <h3 className="mt-5 text-xl font-bold">
                Choose with confidence
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Trust badges help you understand where price information comes
                from and how it has been verified.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <h2 className="text-3xl font-bold">
              Understand our trust badges
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              MediPrice uses trust levels to make price information easier
              to understand.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <span className="text-2xl">✅</span>

              <h3 className="mt-4 text-lg font-bold">
                SEED Verified
              </h3>

              <p className="mt-2 text-slate-600">
                Information verified through the SEED verification process.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <span className="text-2xl">🏥</span>

              <h3 className="mt-4 text-lg font-bold">
                Provider Verified
              </h3>

              <p className="mt-2 text-slate-600">
                Price information supplied or verified by a healthcare
                provider.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <span className="text-2xl">👥</span>

              <h3 className="mt-4 text-lg font-bold">
                Community Reported
              </h3>

              <p className="mt-2 text-slate-600">
                Information reported by members of the community.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-emerald-600 px-6 py-14 text-center text-white">

          <h2 className="text-3xl font-bold md:text-4xl">
            Start comparing healthcare prices
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-emerald-50">
            Find medications, lab tests, and healthcare services available
            around you.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              to="/medications"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Browse Medications
            </Link>

            <Link
              to="/labs-services"
              className="rounded-xl border border-white px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Browse Services
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;