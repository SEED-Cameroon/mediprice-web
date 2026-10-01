import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Button, Field, Notice, TextInput } from "../components/admin/ui";
import { homeFor, useAuth } from "@/context/AuthContext";

/** Only same-site paths are allowed as a return address (no open redirects). */
const safeNext = (value) => (value && value.startsWith("/") && !value.startsWith("//") ? value : null);

const SignIn = () => {
  const { user, status, refresh, login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const next = safeNext(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (status === "unknown") refresh();
  }, [status, refresh]);

  if (status === "signed-in" && user) return <Navigate to={next ?? homeFor(user)} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const signedIn = await login(email.trim(), password);
      navigate(next ?? homeFor(signedIn), { replace: true });
    } catch (err) {
      setError(err.message || "Sign-in failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[28rem] px-4 py-12 sm:py-16">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary" aria-hidden="true">
        <LockKeyhole className="size-7" />
      </span>
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-on-surface">Sign in</h1>
      <p className="mt-2 text-lg leading-8 text-on-surface-variant">
        For the SEED team and for pharmacies, labs and hospitals that update their prices.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
        <Field label="Email">
          <TextInput
            type="email"
            autoComplete="username"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>

        <Field label="Password">
          <div className="relative">
            <TextInput
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pr-14"
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              className="absolute right-1 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </button>
          </div>
        </Field>

        <Notice tone="error">{error}</Notice>

        <Button type="submit" busy={busy} disabled={!email || !password} className="w-full text-lg">
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-base text-on-surface-variant">
        Don't have an account? Pharmacies, labs and hospitals can ask the SEED team to set one up.
      </p>
    </div>
  );
};

export default SignIn;
