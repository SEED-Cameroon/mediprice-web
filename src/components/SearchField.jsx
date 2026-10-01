import { Search, X } from "lucide-react";

/**
 * Search input with a leading icon and a clear button.
 */
const SearchField = ({ id, label, value, onChange, placeholder, size = "md", autoFocus = false }) => {
  const large = size === "lg";

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      <Search
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-outline ${large ? "left-4 size-5" : "left-3.5 size-5"}`}
        aria-hidden="true"
      />

      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
        className={`w-full rounded-lg border border-outline-variant bg-surface-container-lowest pr-12 text-base text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-3 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden ${large ? "h-14 pl-12" : "h-12 pl-11"}`}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-1.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-outline hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Clear search"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default SearchField;
