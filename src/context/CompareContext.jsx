import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/** Most items that fit side by side and stay readable on a phone. */
export const MAX_COMPARE = 4;

const STORAGE_KEY = "mediprice.compare";

const CompareContext = createContext(null);

const load = () => {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};

/**
 * Keeps the in-progress comparison: up to MAX_COMPARE items of one group
 * (medications or services). Session-only, as the SRS asks; the URL of the
 * compare page is what makes a comparison shareable.
 */
export function CompareProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage can be blocked (private mode); the selection still works for this visit.
    }
  }, [items]);

  const has = useCallback((key) => items.some((item) => item.key === key), [items]);

  /**
   * Adds an item. Returns "added", "full", or "replaced" (when the item is
   * from the other group, which starts a new comparison).
   */
  const add = useCallback(
    (item) => {
      const entry = { key: item.key, id: item.id, name: item.name, group: item.group };
      if (items.some((existing) => existing.key === entry.key)) return "added";
      if (items.length > 0 && items[0].group !== entry.group) {
        setItems([entry]);
        return "replaced";
      }
      if (items.length >= MAX_COMPARE) return "full";
      setItems([...items, entry]);
      return "added";
    },
    [items],
  );

  const remove = useCallback((key) => setItems((current) => current.filter((item) => item.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const group = items[0]?.group ?? null;
    const href =
      items.length > 0
        ? `/compare?type=${group}&ids=${items.map((item) => encodeURIComponent(item.id)).join(",")}`
        : "/compare";
    return { items, group, href, has, add, remove, clear, setItems };
  }, [items, has, add, remove, clear]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used inside <CompareProvider>");
  return context;
}
