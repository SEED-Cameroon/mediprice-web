import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Menu, Search, X } from "lucide-react";

const navLinks = [
  { label: "Medications", to: "/catalogue" },
  { label: "Lab tests & services", to: "/services" },
  { label: "How we check prices", to: "/about" },
];

const footerLinks = [
  {
    heading: "Compare prices",
    links: [
      { label: "Medications", to: "/catalogue" },
      { label: "Lab tests", to: "/services?type=Lab+test" },
      { label: "Care services", to: "/services?type=Care+service" },
    ],
  },
  {
    heading: "About MediPrice",
    links: [
      { label: "How it works", to: "/#how-it-works" },
      { label: "What the badges mean", to: "/about#badges" },
      { label: "Our mission", to: "/about" },
    ],
  },
];

const Logo = ({ className = "" }) => (
  <svg
    className={`shrink-0 ${className}`}
    fill="none"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
      fill="currentColor"
    />
  </svg>
);

const HeaderSearch = ({ id, className = "" }) => {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const value = term.trim();
    navigate(value ? `/search?search=${encodeURIComponent(value)}` : "/search");
    setTerm("");
  };

  return (
    <form role="search" onSubmit={submit} className={`flex ${className}`}>
      <label htmlFor={id} className="sr-only">
        Search medicines, lab tests and services
      </label>
      <input
        id={id}
        type="search"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search a medicine or test"
        autoComplete="off"
        className="h-11 min-w-0 flex-1 rounded-l-lg border-0 bg-white px-4 text-base text-on-surface outline-none placeholder:text-outline focus:ring-4 focus:ring-primary-fixed-dim focus:ring-inset"
      />
      <button
        type="submit"
        className="flex h-11 w-12 shrink-0 items-center justify-center rounded-r-lg bg-on-primary-fixed text-white transition-colors hover:bg-black focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-fixed-dim"
      >
        <Search className="size-5" aria-hidden="true" />
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};

const desktopLinkClass = ({ isActive }) =>
  `relative flex h-16 items-center px-3 text-[0.9375rem] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white after:absolute after:inset-x-3 after:bottom-0 after:h-1 after:rounded-t-full ${
    isActive
      ? "text-white after:bg-primary-fixed-dim"
      : "text-white/85 hover:text-white after:bg-transparent hover:after:bg-white/40"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `flex h-14 items-center justify-between border-b border-white/10 px-1 text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
    isActive ? "text-primary-fixed-dim" : "text-white"
  }`;

const Layout = () => {
  const { pathname, hash } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  // Pages that already have their own search box don't repeat it in the header.
  const hasOwnSearch = ["/", "/catalogue", "/services", "/search"].includes(pathname);

  // Close the mobile menu and start each new page at the top.
  useEffect(() => {
    setMenuOpen(false);
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-on-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-surface-container-lowest focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 bg-primary text-white shadow-md shadow-black/10">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6 lg:gap-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-white">
              <Logo className="size-6 text-primary" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight">MediPrice</span>
              <span className="block text-xs font-medium text-white/80">Cameroon healthcare prices</span>
            </span>
          </Link>

          {!hasOwnSearch && <HeaderSearch id="header-search" className="hidden max-w-[26rem] flex-1 md:flex" />}

          <nav aria-label="Main" className="ml-auto hidden lg:block">
            <ul className="flex items-center">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={desktopLinkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="ml-auto flex h-11 items-center gap-2 rounded-lg px-3 text-base font-semibold text-white ring-1 ring-white/40 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Search stays visible on phones, under the logo row */}
        {!hasOwnSearch && (
          <div className="px-4 pb-3 sm:px-6 md:hidden">
            <HeaderSearch id="header-search-mobile" />
          </div>
        )}

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Main" className="bg-on-primary-fixed-variant px-4 pb-4 sm:px-6 lg:hidden">
            <ul className="mx-auto max-w-6xl">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={mobileLinkClass}>
                    {link.label}
                    <ChevronRight className="size-5 opacity-70" aria-hidden="true" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="main" className="w-full flex-1">
        <Outlet />
      </main>

      <footer className="bg-on-surface text-surface-dim">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div className="max-w-[24rem]">
              <div className="flex items-center gap-2.5 text-white">
                <Logo className="size-6 text-primary-fixed-dim" />
                <p className="text-lg font-bold tracking-tight">MediPrice Cameroon</p>
              </div>
              <p className="mt-3 text-sm leading-6">
                Healthcare prices from pharmacies, labs and hospitals in
                Bamenda, with the name of whoever verified each one.
              </p>
            </div>

            {footerLinks.map((group) => (
              <div key={group.heading}>
                <p className="text-sm font-semibold text-white">{group.heading}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="inline-flex min-h-8 items-center rounded-sm transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-fixed-dim"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs sm:flex-row sm:justify-between">
            <p>© 2026 MediPrice Cameroon, a SEED Cameroon initiative.</p>
            <p>Prices shown are sample data while live listings are connected. Photos from Pexels.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
