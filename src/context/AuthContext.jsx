import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { getCurrentUser, signIn, signOut } from "@/services/admin";

const AuthContext = createContext(null);

/**
 * Who is signed in. The session itself lives in an httpOnly cookie the page
 * can't read; this only keeps the user's name and role for the UI. It is
 * loaded on demand (by staff and provider pages), so public visitors never
 * trigger a sign-in check.
 */
export function AuthProvider({ children }) {
  // status: "unknown" (not checked yet) | "loading" | "signed-in" | "signed-out"
  const [state, setState] = useState({ user: null, status: "unknown" });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, status: "loading" }));
    try {
      const user = await getCurrentUser();
      setState({ user, status: "signed-in" });
      return user;
    } catch {
      setState({ user: null, status: "signed-out" });
      return null;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const user = await signIn(email, password);
    setState({ user, status: "signed-in" });
    return user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } finally {
      setState({ user: null, status: "signed-out" });
    }
  }, []);

  const value = useMemo(() => ({ ...state, refresh, login, logout }), [state, refresh, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

/** Where each role lands after signing in. */
// eslint-disable-next-line react-refresh/only-export-components
export const homeFor = (user) => (user?.role === "admin" ? "/admin" : user?.role === "provider" ? "/provider" : "/");
