import { useState } from "react";
import PricesManager from "../components/admin/PricesManager";
import { Button, Card, Field, Notice, PageHeader, TextInput } from "../components/admin/ui";
import { useAuth } from "@/context/AuthContext";
import useApiFetch from "@/hooks/useApiFetch";
import { providersApi } from "@/services/admin";
import { apiFetch } from "@/lib/api";

/** "My prices": a provider keeps its own prices current. */
export const ProviderPrices = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <PageHeader
        title="My prices"
        intro={`Keep ${user.provider?.name ?? "your"} prices up to date. People see them with the badge "Confirmed by provider". If a price hasn't changed, tap "Still the same price" so people know it's current.`}
      />
      {user.providerId ? (
        <PricesManager isAdmin={false} />
      ) : (
        <Notice tone="error">Your account isn't linked to a provider yet. Ask the SEED team to link it.</Notice>
      )}
    </div>
  );
};

/** "My details": contact details shown to people looking for directions. */
export const ProviderDetails = () => {
  const { user } = useAuth();
  const { data, status, error } = useApiFetch(
    () => (user.providerId ? apiFetch(`/providers/${user.providerId}`).then((res) => res.data.provider) : Promise.resolve(null)),
    [user.providerId],
  );
  const [values, setValues] = useState(null);
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const current = values ?? (data && { phone: data.phone ?? "", quarter: data.quarter ?? "", address: data.address ?? "" });
  const set = (name) => (event) => setValues({ ...current, [name]: event.target.value });

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      await providersApi.update(user.providerId, current);
      setMessage({ tone: "success", text: "Details saved." });
    } catch (err) {
      setMessage({ tone: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My details" intro="How people find and contact you. To change your name, ask the SEED team." />
      {status === "loading" ? (
        <p className="text-lg text-on-surface-variant">Loading…</p>
      ) : status === "error" || !current ? (
        <Notice tone="error">{error?.message ?? "Your account isn't linked to a provider yet."}</Notice>
      ) : (
        <Card>
          <p className="text-xl font-bold text-on-surface">{data.name}</p>
          <form onSubmit={save} className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Phone number" hint="e.g. +237 6XX XXX XXX">
              <TextInput required type="tel" inputMode="tel" value={current.phone} onChange={set("phone")} />
            </Field>
            <Field label="Area / quarter" hint="e.g. Nkwen">
              <TextInput value={current.quarter} onChange={set("quarter")} />
            </Field>
            <Field label="Address or directions" className="sm:col-span-2">
              <TextInput value={current.address} onChange={set("address")} />
            </Field>
            {message && (
              <div className="sm:col-span-2">
                <Notice tone={message.tone}>{message.text}</Notice>
              </div>
            )}
            <div className="sm:col-span-2">
              <Button type="submit" busy={busy}>
                Save details
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
