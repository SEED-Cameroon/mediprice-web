import { Link, useLocation } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import { useCompare } from "@/context/CompareContext";

/**
 * Bar pinned to the bottom of the screen while a comparison is in
 * progress, so people can keep browsing and come back to it.
 */
const CompareTray = () => {
  const { items, href, remove, clear, group } = useCompare();
  const { pathname } = useLocation();

  if (items.length === 0 || pathname === "/compare") return null;

  const noun = group === "medication" ? "medicine" : "test or service";
  const ready = items.length >= 2;

  return (
    <aside
      aria-label="Your comparison"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant bg-surface-container-lowest/95 shadow-[0_-8px_24px_rgb(11_28_48/0.12)] backdrop-blur"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <p className="text-base font-bold text-on-surface">
            Comparing {items.length} {items.length === 1 ? noun : noun === "medicine" ? "medicines" : "tests and services"}
          </p>
          <ul className="mt-1.5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {items.map((item) => (
              <li key={item.key} className="shrink-0">
                <span className="inline-flex h-9 items-center gap-1 rounded-lg bg-surface-container pl-3 text-sm font-medium text-on-surface">
                  <span className="max-w-[12rem] truncate">{item.name}</span>
                  <button
                    type="button"
                    onClick={() => remove(item.key)}
                    className="flex size-9 items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <X className="size-4" aria-hidden="true" />
                    <span className="sr-only">Remove {item.name}</span>
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={clear}
            className="h-12 rounded-xl px-4 text-base font-semibold text-on-surface-variant hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Clear
          </button>
          {ready ? (
            <Link
              to={href}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-lg font-bold text-on-primary hover:bg-on-primary-fixed-variant focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 sm:flex-none"
            >
              Compare now
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          ) : (
            <p className="flex-1 text-base text-on-surface-variant sm:flex-none">Add 1 more to compare</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CompareTray;
