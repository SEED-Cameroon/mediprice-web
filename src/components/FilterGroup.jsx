import { Check } from "lucide-react";

/**
 * Single-choice filter. Scrollable chips on small screens, a vertical list
 * in the sidebar on large screens.
 * @param {{ label: string, options: { value: string, label: string, count?: number }[], value: string, onChange: (value: string) => void }} props
 */
const FilterGroup = ({ label, options, value, onChange }) => {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-on-surface">{label}</legend>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:h-10 lg:w-full lg:justify-between lg:rounded-md lg:border-transparent lg:px-3 ${
                active
                  ? "border-on-surface bg-on-surface text-surface-container-lowest lg:bg-primary/10 lg:text-primary"
                  : "border-outline-variant bg-surface-container-lowest text-on-surface hover:border-on-surface lg:bg-transparent lg:hover:bg-surface-container-low"
              }`}
            >
              <span className="flex items-center gap-2">
                <Check
                  className={`hidden size-4 lg:block ${active ? "opacity-100" : "opacity-0"}`}
                  aria-hidden="true"
                />
                {option.label}
              </span>
              {typeof option.count === "number" && (
                <span className={`tabular text-xs ${active ? "" : "text-on-surface-variant"}`}>
                  {option.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
};

export default FilterGroup;
