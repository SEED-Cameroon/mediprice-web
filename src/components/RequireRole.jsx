import { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { homeFor, useAuth } from "@/context/AuthContext";

/**
 * Shows its children only to signed-in users with one of `roles`.
 * Sends signed-out visitors to the sign-in page and back here afterwards.
 */
const RequireRole = ({ roles, children }) => {
  const { user, status, refresh } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (status === "unknown") refresh();
  }, [status, refresh]);

  if (status === "unknown" || status === "loading") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6" aria-busy="true">
        <p className="text-lg text-on-surface-variant">Checking your sign-in…</p>
      </div>
    );
  }

  if (status === "signed-out") {
    return <Navigate to={`/sign-in?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (!roles.includes(user.role)) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">You don't have access to this page</h1>
        <p className="mt-3 text-lg text-on-surface-variant">
          You're signed in as {user.name}. Ask the SEED team if you need access.
        </p>
        <Link to={homeFor(user)} className="mt-6 inline-flex h-12 items-center rounded-xl bg-primary px-6 text-lg font-semibold text-on-primary">
          Go to your page
        </Link>
      </div>
    );
  }

  return children;
};

export default RequireRole;
