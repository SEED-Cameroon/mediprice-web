import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { MAX_COMPARE, useCompare } from "@/context/CompareContext";

const messages = {
  full: `You can compare up to ${MAX_COMPARE} at a time. Remove one first.`,
  replaced: "Started a new comparison. Medicines and tests are compared separately.",
};

/** Toggles an item in the comparison, and says what happened. */
const CompareButton = ({ item, className = "" }) => {
  const { has, add, remove } = useCompare();
  const [message, setMessage] = useState("");
  const selected = has(item.key);

  const toggle = () => {
    if (selected) {
      remove(item.key);
      setMessage("");
      return;
    }
    const result = add(item);
    setMessage(messages[result] ?? "");
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={selected}
        className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-lg font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto ${
          selected
            ? "bg-on-surface text-white hover:bg-inverse-surface"
            : "bg-surface-container-lowest text-on-surface ring-1 ring-outline-variant hover:ring-on-surface"
        }`}
      >
        {selected ? <Check className="size-5" aria-hidden="true" /> : <Plus className="size-5" aria-hidden="true" />}
        {selected ? "Added to compare" : "Add to compare"}
      </button>
      <p role="status" className="mt-2 text-base text-on-surface-variant empty:hidden">
        {message}
      </p>
    </div>
  );
};

export default CompareButton;
