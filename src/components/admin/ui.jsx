import { useState } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";

/**
 * Small form kit for the admin and provider screens. Sized for everyone:
 * 16px text, 44px+ targets, labels above inputs.
 */

const inputClass =
  "h-12 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 text-base text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-3 focus:ring-primary/20 disabled:opacity-60";

export const Field = ({ label, hint, error, children, className = "" }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-base font-semibold text-on-surface">{label}</span>
    {children}
    {hint && !error && <span className="mt-1 block text-sm text-on-surface-variant">{hint}</span>}
    {error && <span className="mt-1 block text-sm font-medium text-error">{error}</span>}
  </label>
);

export const TextInput = (props) => <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;

export const TextArea = (props) => (
  <textarea {...props} className={`${inputClass} h-auto min-h-24 py-3 ${props.className ?? ""}`} />
);

export const Select = ({ children, ...props }) => (
  <select {...props} className={`${inputClass} ${props.className ?? ""}`}>
    {children}
  </select>
);

const buttonStyles = {
  primary: "bg-primary text-on-primary hover:bg-on-primary-fixed-variant",
  secondary: "bg-surface-container-lowest text-on-surface ring-1 ring-outline-variant hover:ring-on-surface",
  danger: "bg-surface-container-lowest text-error ring-1 ring-error/40 hover:bg-error-container",
  ghost: "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
};

export const Button = ({ variant = "primary", className = "", busy = false, children, ...props }) => (
  <button
    type="button"
    {...props}
    disabled={props.disabled || busy}
    className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${buttonStyles[variant]} ${className}`}
  >
    {busy ? "Please wait…" : children}
  </button>
);

/** A delete-style button that asks "Are you sure?" inline before acting. */
export const ConfirmButton = ({ label, confirmLabel = "Yes, delete", onConfirm, className = "" }) => {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!asking) {
    return (
      <Button variant="danger" className={className} onClick={() => setAsking(true)}>
        {label}
      </Button>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span className="text-base font-medium text-on-surface">Are you sure?</span>
      <Button
        variant="danger"
        busy={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setAsking(false);
          }
        }}
      >
        {confirmLabel}
      </Button>
      <Button variant="ghost" onClick={() => setAsking(false)}>
        Cancel
      </Button>
    </span>
  );
};

/** Success or error message, announced to screen readers. */
export const Notice = ({ tone = "success", children }) => {
  if (!children) return null;
  const Icon = tone === "success" ? CircleCheck : CircleAlert;
  const styles =
    tone === "success"
      ? "bg-primary/10 text-on-surface ring-primary/30"
      : "bg-error-container text-on-error-container ring-error/30";
  return (
    <p role={tone === "success" ? "status" : "alert"} className={`flex gap-3 rounded-xl px-4 py-3 text-base ring-1 ${styles}`}>
      <Icon className={`mt-0.5 size-5 shrink-0 ${tone === "success" ? "text-primary" : "text-error"}`} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
};

export const PageHeader = ({ title, intro, actions }) => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{title}</h1>
      {intro && <p className="mt-2 max-w-[42rem] text-lg leading-8 text-on-surface-variant">{intro}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
  </header>
);

export const Card = ({ children, className = "" }) => (
  <section className={`rounded-2xl bg-surface-container-lowest p-5 shadow-sm ring-1 ring-outline-variant/70 sm:p-6 ${className}`}>
    {children}
  </section>
);
