import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import usePageMeta from "@/hooks/usePageMeta";

/** Frame for the admin and provider areas: tabs, who's signed in, sign out. */
const StaffLayout = ({ title, tabs }) => {
  usePageMeta({ title, noindex: true });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate("/sign-in", { replace: true });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6 sm:pt-8">
      <div className="flex flex-col gap-4 border-b border-outline-variant pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">{title}</p>
          <p className="text-base text-on-surface">
            Signed in as <strong className="font-semibold">{user.name}</strong>
            {user.provider && <> for {user.provider.name}</>}
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex h-11 items-center gap-2 self-start rounded-xl px-4 text-base font-semibold text-on-surface ring-1 ring-outline-variant hover:ring-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:self-auto"
        >
          <LogOut className="size-5" aria-hidden="true" />
          Sign out
        </button>
      </div>

      {tabs.length > 1 && (
        <nav aria-label={title} className="mt-4">
          <ul className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <li key={tab.to}>
                <NavLink
                  to={tab.to}
                  end={tab.end}
                  className={({ isActive }) =>
                    `inline-flex h-11 items-center rounded-xl px-4 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive ? "bg-on-surface text-white" : "text-on-surface ring-1 ring-outline-variant hover:ring-on-surface"
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
};

export default StaffLayout;
