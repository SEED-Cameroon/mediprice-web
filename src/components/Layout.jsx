import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
      <header className="border-b bg-white">
        <nav
          className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            MediPrice
          </Link>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Home
            </Link>

            <Link
              to="/catalogue"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Catalogue
            </Link>

            <Link
              to="/services"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Services
            </Link>
          </div>
        </nav>
      </header>

      <main className="w-full">
        <Outlet />
      </main>

      <footer className="border-t bg-white px-4 py-6">
        <div className="mx-auto w-full max-w-7xl text-center text-sm text-gray-600">
          © 2026 MediPrice Cameroon
        </div>
      </footer>
    </div>
  );
};

export default Layout;