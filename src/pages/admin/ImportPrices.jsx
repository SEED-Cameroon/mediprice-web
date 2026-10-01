import { useRef, useState } from "react";
import { CircleAlert, CircleCheck, Download, FileUp, Minus, RefreshCw } from "lucide-react";
import { Button, Card, Notice, PageHeader } from "../../components/admin/ui";
import { parseCsv, toCsv } from "@/lib/csv";
import { formatFCFA } from "@/lib/format";
import { importPrices } from "@/services/admin";

/** Column names in the template, and other headers people commonly use. */
const COLUMNS = {
  itemType: ["type", "item_type", "itemtype"],
  item: ["item", "name", "medicine", "medication", "service", "test"],
  provider: ["provider", "pharmacy", "hospital", "lab", "laboratory"],
  amount: ["price_fcfa", "price", "amount", "fcfa", "prix"],
  trustBadge: ["trust_badge", "checked_by", "badge", "verified_by"],
  checkedAt: ["checked_on", "checked_at", "date", "checked"],
};

const TEMPLATE = [
  ["type", "item", "provider", "price_fcfa", "trust_badge", "checked_on"],
  ["medication", "Paracetamol 500mg", "Commercial Avenue Pharmacy", "500", "seed_verified", "2026-09-30"],
  ["service", "Full blood count", "Regional Hospital Bamenda", "3000", "seed_verified", "2026-09-30"],
];

const normaliseHeader = (header) => header.toLowerCase().trim().replace(/[\s-]+/g, "_");

/** "3,000", "3 000" and "3000 FCFA" all become "3000". */
const cleanAmount = (value) => String(value ?? "").replace(/fcfa|xaf|f\b/gi, "").replace(/[\s,.]/g, "");

/** Turns CSV rows into import rows, using the header to find each column. */
function rowsFromCsv(text) {
  const [header, ...lines] = parseCsv(text);
  if (!header) throw new Error("The file is empty.");

  const headers = header.map(normaliseHeader);
  const position = Object.fromEntries(
    Object.entries(COLUMNS).map(([key, names]) => [key, headers.findIndex((name) => names.includes(name))]),
  );
  const missing = ["itemType", "item", "provider", "amount"].filter((key) => position[key] === -1);
  if (missing.length) {
    throw new Error(
      `The file needs these columns: type, item, provider, price_fcfa. Missing: ${missing
        .map((key) => COLUMNS[key][0])
        .join(", ")}. Download the template to see the layout.`,
    );
  }

  return lines.map((cells) => {
    const get = (key) => (position[key] === -1 ? undefined : cells[position[key]]);
    return {
      itemType: get("itemType"),
      item: get("item"),
      provider: get("provider"),
      amount: cleanAmount(get("amount")),
      trustBadge: get("trustBadge") || undefined,
      checkedAt: get("checkedAt") || undefined,
    };
  });
}

const statusStyles = {
  create: { label: "Will be added", done: "Added", icon: CircleCheck, className: "text-primary" },
  update: { label: "Will be updated", done: "Updated", icon: RefreshCw, className: "text-secondary" },
  unchanged: { label: "No change", done: "No change", icon: Minus, className: "text-on-surface-variant" },
  error: { label: "Can't import", done: "Not imported", icon: CircleAlert, className: "text-error" },
};

const ImportPrices = () => {
  const fileInput = useRef(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState(null);
  const [check, setCheck] = useState(null);
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setRows(null);
    setCheck(null);
    setDone(null);
    setError("");
    setFileName("");
    if (fileInput.current) fileInput.current.value = "";
  };

  const downloadTemplate = () => {
    const blob = new Blob([toCsv(TEMPLATE)], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "mediprice-prices-template.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Step 2: read the file and ask the server to check it (nothing is saved).
  const chooseFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    reset();
    setFileName(file.name);
    setBusy(true);
    try {
      if (file.size > 1_000_000) throw new Error("The file is too big. Split it into files of at most 2,000 rows.");
      const parsed = rowsFromCsv(await file.text());
      if (parsed.length === 0) throw new Error("The file has a header but no price rows.");
      setRows(parsed);
      setCheck(await importPrices(parsed, true));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  // Step 3: save the valid rows.
  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      setDone(await importPrices(rows, false));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const result = done ?? check;
  const toSave = check ? check.summary.create + check.summary.update + check.summary.unchanged : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Import prices from a spreadsheet"
        intro="For prices collected on field visits. The file is checked first and nothing is saved until you confirm."
      />

      <Card>
        <h2 className="text-xl font-bold text-on-surface">1. Fill in the template</h2>
        <p className="mt-2 max-w-[44rem] text-base leading-7 text-on-surface-variant">
          One row per price. Use the exact medicine, test and provider names shown on MediPrice. Add new medicines or
          providers first in the other tabs. <strong className="text-on-surface">trust_badge</strong> and{" "}
          <strong className="text-on-surface">checked_on</strong> are optional (they default to "Checked by SEED" and today).
          Save as CSV from Excel or Google Sheets.
        </p>
        <Button variant="secondary" className="mt-4" onClick={downloadTemplate}>
          <Download className="size-5" aria-hidden="true" />
          Download template
        </Button>
      </Card>

      <Card>
        <h2 className="text-xl font-bold text-on-surface">2. Choose your file</h2>
        <label className="mt-4 flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant px-4 py-6 text-center hover:border-primary focus-within:border-primary">
          <FileUp className="size-7 text-primary" aria-hidden="true" />
          <span className="text-lg font-semibold text-on-surface">{fileName || "Choose a CSV file"}</span>
          <span className="text-sm text-on-surface-variant">Up to 2,000 rows</span>
          <input ref={fileInput} type="file" accept=".csv,text/csv" onChange={chooseFile} className="sr-only" />
        </label>
        {busy && !check && <p className="mt-4 text-base text-on-surface-variant">Checking the file…</p>}
        {error && (
          <div className="mt-4">
            <Notice tone="error">{error}</Notice>
          </div>
        )}
      </Card>

      {result && (
        <Card>
          <h2 className="text-xl font-bold text-on-surface">{done ? "Import complete" : "3. Check and confirm"}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-4" aria-label="Summary">
            {Object.entries(statusStyles).map(([key, style]) => (
              <li key={key} className="rounded-xl bg-surface-container-low px-4 py-3">
                <p className="tabular text-2xl font-extrabold text-on-surface">{result.summary[key]}</p>
                <p className={`text-base font-medium ${style.className}`}>{done ? style.done : style.label}</p>
              </li>
            ))}
          </ul>

          <ol className="mt-5 divide-y divide-outline-variant/60 rounded-xl ring-1 ring-outline-variant/70" aria-label="Rows">
            {result.rows.map((row) => {
              const style = statusStyles[row.status];
              const Icon = style.icon;
              return (
                <li key={row.line} className="flex gap-3 px-4 py-3">
                  <Icon className={`mt-1 size-5 shrink-0 ${style.className}`} aria-hidden="true" />
                  <div className="min-w-0 text-base">
                    <p className="text-on-surface">
                      <span className="text-on-surface-variant">Row {row.line}: </span>
                      <strong className="font-semibold">{row.item || "(no item)"}</strong> at {row.provider || "(no provider)"}
                      {row.amount && (
                        <span className="tabular">
                          , {formatFCFA(row.amount)}
                          {row.status === "update" && row.previousAmount !== null && <> (was {formatFCFA(row.previousAmount)})</>}
                        </span>
                      )}
                    </p>
                    <p className={`text-sm font-medium ${style.className}`}>{row.message ?? (done ? style.done : style.label)}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 flex flex-wrap gap-3">
            {!done && (
              <Button onClick={confirm} busy={busy} disabled={toSave === 0}>
                {toSave === 0 ? "Nothing to import" : `Import ${toSave} ${toSave === 1 ? "row" : "rows"}`}
              </Button>
            )}
            <Button variant="secondary" onClick={reset}>
              {done ? "Import another file" : "Choose a different file"}
            </Button>
          </div>
          {!done && check.summary.error > 0 && toSave > 0 && (
            <p className="mt-3 text-base text-on-surface-variant">
              Rows marked "Can't import" will be skipped. Fix them in the spreadsheet and import them again later.
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default ImportPrices;
