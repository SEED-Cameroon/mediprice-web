import { useState } from "react";
import { KeyRound, Plus } from "lucide-react";
import { Button, Card, ConfirmButton, Field, Notice, PageHeader, Select, TextInput } from "../../components/admin/ui";
import { useAuth } from "@/context/AuthContext";
import useApiFetch from "@/hooks/useApiFetch";
import { providersApi, usersApi } from "@/services/admin";

const roleLabels = { admin: "SEED team (admin)", provider: "Provider", user: "No access" };

const NewAccountForm = ({ providers, onCreated }) => {
  const [values, setValues] = useState({ name: "", email: "", password: "", role: "provider", providerId: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (name) => (event) => setValues((current) => ({ ...current, [name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await usersApi.create({ ...values, providerId: values.role === "provider" ? values.providerId : null });
      onCreated(`Created an account for ${user.name}. Give them their email and password; they can sign in now.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-4 text-xl font-bold text-on-surface">New account</h2>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <TextInput required value={values.name} onChange={set("name")} />
        </Field>
        <Field label="Email">
          <TextInput required type="email" autoComplete="off" value={values.email} onChange={set("email")} />
        </Field>
        <Field label="Password" hint="At least 8 characters. Share it with them privately.">
          <TextInput required minLength={8} type="text" autoComplete="new-password" value={values.password} onChange={set("password")} />
        </Field>
        <Field label="Access">
          <Select value={values.role} onChange={set("role")}>
            <option value="provider">Provider: updates its own prices</option>
            <option value="admin">SEED team: manages everything</option>
          </Select>
        </Field>
        {values.role === "provider" && (
          <Field label="Provider" className="sm:col-span-2">
            <Select required value={values.providerId} onChange={set("providerId")}>
              <option value="">Choose the provider this account manages</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </Select>
          </Field>
        )}
        {error && (
          <div className="sm:col-span-2">
            <Notice tone="error">{error}</Notice>
          </div>
        )}
        <div className="sm:col-span-2">
          <Button type="submit" busy={busy}>
            Create account
          </Button>
        </div>
      </form>
    </Card>
  );
};

const AccountRow = ({ account, isMe, onChanged }) => {
  const [resetting, setResetting] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const reset = async (event) => {
    event.preventDefault();
    try {
      await usersApi.update(account.id, { password });
      setMessage({ tone: "success", text: "Password changed. Share the new one with them privately." });
      setResetting(false);
      setPassword("");
    } catch (err) {
      setMessage({ tone: "error", text: err.message });
    }
  };

  return (
    <li>
      <Card className="!p-4 sm:!p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-lg font-bold text-on-surface">
              {account.name}
              {isMe && <span className="font-normal text-on-surface-variant"> (you)</span>}
            </p>
            <p className="break-all text-base text-on-surface-variant">{account.email}</p>
            <p className="text-base text-on-surface">
              {roleLabels[account.role]}
              {account.provider && <> for {account.provider.name}</>}
            </p>
          </div>
          {!isMe && (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" onClick={() => setResetting((open) => !open)} aria-expanded={resetting}>
                <KeyRound className="size-5" aria-hidden="true" />
                Reset password
              </Button>
              <ConfirmButton
                label="Delete"
                onConfirm={async () => {
                  try {
                    await usersApi.remove(account.id);
                    onChanged(`Deleted ${account.name}'s account.`);
                  } catch (err) {
                    setMessage({ tone: "error", text: err.message });
                  }
                }}
              />
            </div>
          )}
        </div>
        {resetting && (
          <form onSubmit={reset} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="New password" hint="At least 8 characters" className="sm:w-80">
              <TextInput required minLength={8} type="text" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </Field>
            <Button type="submit">Save password</Button>
          </form>
        )}
        {message && (
          <div className="mt-3">
            <Notice tone={message.tone}>{message.text}</Notice>
          </div>
        )}
      </Card>
    </li>
  );
};

const AdminAccounts = () => {
  const { user } = useAuth();
  const accounts = useApiFetch(() => usersApi.list(), []);
  const providers = useApiFetch(() => providersApi.list(), []);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  const changed = (text) => {
    setAdding(false);
    setMessage(text);
    accounts.reload();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        intro="Give each pharmacy, lab or hospital its own sign-in so it can keep its prices up to date."
        actions={
          !adding && (
            <Button onClick={() => setAdding(true)}>
              <Plus className="size-5" aria-hidden="true" />
              New account
            </Button>
          )
        }
      />
      <Notice>{message}</Notice>
      {adding && <NewAccountForm providers={providers.data ?? []} onCreated={changed} />}
      {accounts.status === "loading" ? (
        <p className="text-lg text-on-surface-variant">Loading…</p>
      ) : accounts.status === "error" ? (
        <Notice tone="error">{accounts.error.message}</Notice>
      ) : (
        <ul className="space-y-3">
          {accounts.data.map((account) => (
            <AccountRow key={account.id} account={account} isMe={account.id === user.id} onChanged={changed} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminAccounts;
