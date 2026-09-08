import { Link, Outlet } from "react-router-dom";

const navLinks = [
  { label: "Compare prices", to: "/catalogue" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "Providers", to: "#" },
  { label: "About us", to: "#" },
];

const footerLinks = {
  Platform: [
    { label: "Find drugs", to: "/catalogue" },
    { label: "Lab tests", to: "/services" },
    { label: "Hospital services", to: "/services" },
    { label: "Price analysis", to: "#" },
  ],
  Company: [
    { label: "About SEED", to: "#" },
    { label: "Partner with us", to: "#" },
    { label: "Contact support", to: "#" },
    { label: "Privacy policy", to: "#" },
  ],
};

const Wordmark = ({ className }) => (
  <svg
    className={className}
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

const Layout = () => {
  return (
    <div className="min-h-screen w-full bg-paper text-ink">
      <header className="sticky top-0 z-50 flex flex-col gap-4 border-b border-line bg-paper-raised px-6 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <Link
          to="/"
          className="flex items-center gap-3 text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
        >
          <Wordmark className="size-7 shrink-0 text-forest" />
          <span className="font-display text-lg font-semibold leading-tight">
            MediPrice Cameroon
          </span>
        </Link>

        <nav
          className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:justify-end sm:gap-9"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="rounded-sm text-sm font-medium text-ink-soft transition-colors hover:text-forest focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="w-full">
        <Outlet />
      </main>

      <footer className="bg-forest-deep py-xl text-paper">
        <div className="mx-auto max-w-container-max px-gutter">
          <div className="mb-xl grid grid-cols-2 gap-xl md:grid-cols-4">
            <div className="col-span-2">
              <div className="mb-md flex items-center gap-2">
                <Wordmark className="size-6 text-paper" />
                <h4 className="font-display text-xl font-semibold">
                  MediPrice Cameroon
                </h4>
              </div>

              <p className="max-w-96 text-sm text-paper/70">
                Improving health outcomes through radical price transparency.
                We believe everyone deserves to know the cost of care before
                they arrive.
              </p>
            </div>

            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h5 className="mb-md text-sm font-semibold">{heading}</h5>

                <ul className="flex flex-col gap-sm text-sm text-paper/70">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="rounded-sm transition-colors hover:text-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-forest-deep"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-md border-t border-paper/15 pt-lg md:flex-row">
            <p className="text-xs text-paper/60">
              © 2026 MediPrice Cameroon. All rights reserved. A SEED
              initiative.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
