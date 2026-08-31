const Home = () => {
  return (
    <main className="w-full">
      <section className="px-4 py-10 sm:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Find and compare healthcare prices
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
              Search for medications, laboratory tests, and healthcare
              services and compare prices from trusted providers.
            </p>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="w-full rounded-md bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
              >
                Browse medications
              </button>

              <button
                type="button"
                className="w-full rounded-md border px-5 py-3 font-medium transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
              >
                Find a service
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;