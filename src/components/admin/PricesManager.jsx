import { useEffect, useMemo, useState } from "react";
import { ChevronDown, History, Plus } from "lucide-react";
import useApiFetch from "@/hooks/useApiFetch";
import { formatDate, formatFCFA } from "@/lib/format";
import {
  deletePrice,
  getPriceHistory,
  listManagedPrices,
  medicationsApi,
  providersApi,
  savePrice,
  servicesApi,
  updatePrice,
} from "@/services/admin";
import Freshness from "../Freshness";
import TrustBadge from "../TrustBadge";
import { BADGE_OPTIONS, badgeKey, todayIso } from "@/lib/admin-helpers";
import { Button, Card, ConfirmButton, Field, Notice, Select, TextInput } from "./ui";

const sourceLabels = { admin: "SEED team", provider: "Provider", import: "Spreadsheet import" };
const changeLabels = { created: "Added", updated: "Changed", deleted: "Removed" };

/** Every change to one price, newest first. */
const PriceHistory = ({ priceId }) => {
  const { data, status, error } = useApiFetch(() => getPriceHistory(priceId), [priceId]);

  if (status === "loading") return <p className="text-base text-on-surface-variant">Loading history…</p>;
  if (status === "error") return <Notice tone="error">{error.message}</Notice>;
  if (data.length === 0) return <p className="text-base text-on-surface-variant">No changes recorded yet.</p>;

  return (
    <ol className="space-y-2" aria-label="Price history">
      {data.map((entry) => (
        <li key={entry._id} className="rounded-xl bg-surface-container-low px-4 py-3 text-base text-on-surface">
          <strong className="font-semibold">{changeLabels[entry.change]}</strong>
          {entry.change === "updated" && entry.previousAmount !== entry.amount ? (
            <span className="tabular">
              {" "}
              from {formatFCFA(entry.previousAmount)} to {formatFCFA(entry.amount)}
            </span>
          ) : (
            <span className="tabular"> at {formatFCFA(entry.amount)}</span>
          )}
          <span className="block text-sm text-on-surface-variant">
            {formatDate(entry.createdAt)} by {entry.changedBy?.name ?? "unknown"} ({sourceLabels[entry.source] ?? entry.source})
          </span>
        </li>
      ))}
    </ol>
  );
};

/** One price: change the amount (and badge, for admins), re-confirm, see history, remove. */
const PriceRow = ({ price, isAdmin, onChanged }) => {
  const [amount, setAmount] = useState(String(price.amount));
  const [badge, setBadge] = useState(price.trustBadge);
  const [checkedAt, setCheckedAt] = useState(todayIso());
  const [showHistory, setShowHistory] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  // Keep the inputs in step with the saved price after a reload (the card
  // stays mounted, so its success message isn't lost).
  useEffect(() => {
    setAmount(String(price.amount));
    setBadge(price.trustBadge);
  }, [price.amount, price.trustBadge]);

  const dirty = Number(amount) !== price.amount || badge !== price.trustBadge;

  const save = async (confirmOnly = false) => {
    setBusy(true);
    setMessage(null);
    try {
      await updatePrice(price._id, {
        amount: confirmOnly ? price.amount : Number(amount),
        ...(isAdmin ? { trustBadge: badge } : {}),
        checkedAt,
      });
      setMessage({ tone: "success", text: confirmOnly ? "Marked as checked today." : "Price saved." });
      onChanged();
    } catch (error) {
      setMessage({ tone: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    try {
      await deletePrice(price._id);
      onChanged();
    } catch (error) {
      setMessage({ tone: "error", text: error.message });
    }
  };

  return (
    <li>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-on-surface">{price.item?.name ?? "Deleted item"}</h3>
            <p className="text-base text-on-surface-variant">
              {isAdmin && <>{price.providerId?.name}. </>}
              {price.item?.form ?? (price.itemType === "service" ? "One test or visit" : "")}
            </p>
          </div>
          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <p className="tabular text-2xl font-extrabold text-on-surface">{formatFCFA(price.amount)}</p>
            <TrustBadge status={badgeKey(price.trustBadge)} size="sm" />
            <Freshness date={price.updatedAt} />
          </div>
        </div>

        <form
          className="mt-4 grid gap-4 border-t border-outline-variant/60 pt-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <Field label="Price (FCFA)">
            <TextInput
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Field>
          {isAdmin && (
            <Field label="Checked by">
              <Select value={badge} onChange={(event) => setBadge(event.target.value)}>
                {BADGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          )}
          <Field label="Checked on">
            <TextInput type="date" max={todayIso()} value={checkedAt} onChange={(event) => setCheckedAt(event.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-2">
            {dirty ? (
              <Button type="submit" busy={busy}>
                Save price
              </Button>
            ) : (
              <Button variant="secondary" busy={busy} onClick={() => save(true)}>
                Still the same price
              </Button>
            )}
          </div>
        </form>

        {message && (
          <div className="mt-4">
            <Notice tone={message.tone}>{message.text}</Notice>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setShowHistory((shown) => !shown)} aria-expanded={showHistory}>
            <History className="size-5" aria-hidden="true" />
            {showHistory ? "Hide history" : "Show history"}
          </Button>
          <ConfirmButton label="Remove price" onConfirm={remove} />
        </div>
        {showHistory && (
          <div className="mt-3">
            <PriceHistory priceId={price._id} />
          </div>
        )}
      </Card>
    </li>
  );
};

/** Form to add a price. Providers don't choose a provider or badge. */
const AddPriceForm = ({ isAdmin, existing, onAdded }) => {
  const [itemType, setItemType] = useState("medication");
  const [itemId, setItemId] = useState("");
  const [providerId, setProviderId] = useState("");
  const [amount, setAmount] = useState("");
  const [badge, setBadge] = useState("seed_verified");
  const [checkedAt, setCheckedAt] = useState(todayIso());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const items = useApiFetch(() => (itemType === "medication" ? medicationsApi.list() : servicesApi.list()), [itemType]);
  const providers = useApiFetch(() => (isAdmin ? providersApi.list() : Promise.resolve([])), [isAdmin]);

  // Providers only see items they don't price yet; admins see everything.
  const choosable = (items.data ?? []).filter(
    (item) => isAdmin || !existing.some((price) => String(price.itemId) === item._id),
  );

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const result = await savePrice({
        itemType,
        itemId,
        amount: Number(amount),
        checkedAt,
        ...(isAdmin ? { providerId, trustBadge: badge } : {}),
      });
      setMessage({ tone: "success", text: result.change === "created" ? "Price added." : "That price already existed, so it was updated." });
      setAmount("");
      setItemId("");
      onAdded();
    } catch (error) {
      setMessage({ tone: "error", text: error.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold text-on-surface">Add a price</h2>
      <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Type">
          <Select
            value={itemType}
            onChange={(event) => {
              setItemType(event.target.value);
              setItemId("");
            }}
          >
            <option value="medication">Medicine</option>
            <option value="service">Lab test or care service</option>
          </Select>
        </Field>
        <Field label={itemType === "medication" ? "Medicine" : "Test or service"}>
          <Select required value={itemId} onChange={(event) => setItemId(event.target.value)} disabled={items.status !== "ready"}>
            <option value="">{items.status === "loading" ? "Loading…" : "Choose one"}</option>
            {choosable.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
                {item.form ? `, ${item.form.toLowerCase()}` : ""}
              </option>
            ))}
          </Select>
        </Field>
        {isAdmin && (
          <Field label="Provider">
            <Select required value={providerId} onChange={(event) => setProviderId(event.target.value)}>
              <option value="">Choose one</option>
              {(providers.data ?? []).map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </Select>
          </Field>
        )}
        <Field label="Price (FCFA)" hint="Whole number, e.g. 1500">
          <TextInput
            required
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </Field>
        {isAdmin && (
          <Field label="Checked by">
            <Select value={badge} onChange={(event) => setBadge(event.target.value)}>
              {BADGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        )}
        <Field label="Checked on">
          <TextInput type="date" max={todayIso()} value={checkedAt} onChange={(event) => setCheckedAt(event.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Button type="submit" busy={busy} disabled={!itemId || !amount || (isAdmin && !providerId)}>
            <Plus className="size-5" aria-hidden="true" />
            Add price
          </Button>
        </div>
      </form>
      {message && (
        <div className="mt-4">
          <Notice tone={message.tone}>{message.text}</Notice>
        </div>
      )}
    </Card>
  );
};

/**
 * Price management shared by the admin dashboard (all prices, any badge)
 * and the provider portal (own prices only, always "Confirmed by provider").
 */
const PricesManager = ({ isAdmin }) => {
  const [search, setSearch] = useState("");
  const [itemType, setItemType] = useState("");
  const [badge, setBadge] = useState("");
  const [adding, setAdding] = useState(false);
  const { data, status, error, reload } = useApiFetch(() => listManagedPrices(), []);

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? [])
      .filter((price) => !itemType || price.itemType === itemType)
      .filter((price) => !badge || price.trustBadge === badge)
      .filter(
        (price) =>
          !term ||
          price.item?.name.toLowerCase().includes(term) ||
          price.providerId?.name.toLowerCase().includes(term),
      )
      .sort((a, b) => (a.item?.name ?? "").localeCompare(b.item?.name ?? ""));
  }, [data, search, itemType, badge]);

  return (
    <div className="space-y-6">
      <div>
        <Button variant={adding ? "secondary" : "primary"} onClick={() => setAdding((open) => !open)} aria-expanded={adding}>
          {adding ? <ChevronDown className="size-5" aria-hidden="true" /> : <Plus className="size-5" aria-hidden="true" />}
          {adding ? "Close" : "Add a price"}
        </Button>
      </div>
      {adding && <AddPriceForm isAdmin={isAdmin} existing={data ?? []} onAdded={reload} />}

      {/* Filters only help once there's a longer list (a small pharmacy may have a handful). */}
      {(isAdmin || (data ?? []).length > 5) && (
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Search">
          <TextInput
            type="search"
            placeholder={isAdmin ? "Medicine, test or provider" : "Medicine or test"}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Field>
        <Field label="Type">
          <Select value={itemType} onChange={(event) => setItemType(event.target.value)}>
            <option value="">Everything</option>
            <option value="medication">Medicines</option>
            <option value="service">Tests and services</option>
          </Select>
        </Field>
        {isAdmin && (
          <Field label="Checked by">
            <Select value={badge} onChange={(event) => setBadge(event.target.value)}>
              <option value="">Anyone</option>
              {BADGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        )}
      </div>
      )}

      {/* Only the first load shows "Loading"; reloads keep the list (and its messages) on screen. */}
      {status === "loading" && !data ? (
        <p className="text-lg text-on-surface-variant" aria-busy="true">
          Loading prices…
        </p>
      ) : status === "error" && !data ? (
        <Notice tone="error">{error.message}</Notice>
      ) : (
        <>
          <p className="text-base text-on-surface" aria-live="polite">
            <strong>{shown.length}</strong> {shown.length === 1 ? "price" : "prices"}
          </p>
          {shown.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-outline-variant p-6 text-lg text-on-surface-variant">
              {(data ?? []).length === 0 ? "No prices yet. Use “Add a price” to add the first one." : "No prices match. Try another search."}
            </p>
          ) : (
            <ul className="space-y-4">
              {shown.map((price) => (
                <PriceRow key={price._id} price={price} isAdmin={isAdmin} onChanged={reload} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default PricesManager;
