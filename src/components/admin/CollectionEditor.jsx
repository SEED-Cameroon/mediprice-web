import { useMemo, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import useApiFetch from "@/hooks/useApiFetch";
import { Button, Card, ConfirmButton, Field, Notice, Select, TextArea, TextInput } from "./ui";

/** Empty form values for a field list. */
const blank = (fields) =>
  Object.fromEntries(fields.map((field) => [field.name, field.type === "checkbox" ? false : field.default ?? ""]));

/** Record -> form values (strings for inputs). */
const toForm = (fields, record) =>
  Object.fromEntries(
    fields.map((field) => {
      const value = field.get ? field.get(record) : record[field.name];
      return [field.name, field.type === "checkbox" ? Boolean(value) : value ?? ""];
    }),
  );

/** Form values -> request body, dropping empty optional values. */
const toBody = (fields, values) => {
  const body = {};
  for (const field of fields) {
    if (field.set) Object.assign(body, field.set(values[field.name], values));
    else if (field.type === "checkbox") body[field.name] = Boolean(values[field.name]);
    else if (values[field.name] !== "") body[field.name] = values[field.name];
  }
  return body;
};

const RecordForm = ({ fields, initial, submitLabel, onSubmit, onCancel }) => {
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSubmit(toBody(fields, values));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => {
        const common = { required: field.required, value: values[field.name], onChange: (event) => set(field.name, event.target.value) };
        return field.type === "checkbox" ? (
          <label key={field.name} className="flex min-h-12 items-center gap-3 text-base text-on-surface sm:col-span-2">
            <input
              type="checkbox"
              checked={values[field.name]}
              onChange={(event) => set(field.name, event.target.checked)}
              className="size-5 accent-primary"
            />
            {field.label}
          </label>
        ) : (
          <Field key={field.name} label={field.label} hint={field.hint} className={field.type === "textarea" || field.wide ? "sm:col-span-2" : ""}>
            {field.type === "select" ? (
              <Select {...common}>
                {!field.required && <option value="">None</option>}
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            ) : field.type === "textarea" ? (
              <TextArea {...common} rows={3} />
            ) : (
              <TextInput {...common} type={field.type ?? "text"} inputMode={field.inputMode} step={field.step} />
            )}
          </Field>
        );
      })}
      {error && (
        <div className="sm:col-span-2">
          <Notice tone="error">{error}</Notice>
        </div>
      )}
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <Button type="submit" busy={busy}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

/**
 * A searchable list of records with add, edit and delete.
 * @param {{ api: { list, create, update, remove }, fields: object[], noun: string, describe: (record) => string, deleteWarning?: string }} props
 */
const CollectionEditor = ({ api, fields, noun, plural, describe, deleteWarning }) => {
  const { data, status, error, reload } = useApiFetch(() => api.list(), [api]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // record id, or "new"
  const [message, setMessage] = useState(null);

  const shown = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? [])
      .filter((record) => !term || record.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data, search]);

  const done = (text) => {
    setEditing(null);
    setMessage({ tone: "success", text });
    reload();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Field label={`Search ${plural}`} className="sm:w-80">
          <TextInput type="search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </Field>
        {editing !== "new" && (
          <Button
            onClick={() => {
              setEditing("new");
              setMessage(null);
            }}
          >
            <Plus className="size-5" aria-hidden="true" />
            Add {noun}
          </Button>
        )}
      </div>

      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      {editing === "new" && (
        <Card>
          <h2 className="mb-4 text-xl font-bold text-on-surface">Add {noun}</h2>
          <RecordForm
            fields={fields}
            initial={blank(fields)}
            submitLabel={`Add ${noun}`}
            onCancel={() => setEditing(null)}
            onSubmit={async (body) => {
              await api.create(body);
              done(`Added ${body.name}.`);
            }}
          />
        </Card>
      )}

      {status === "loading" && !data ? (
        <p className="text-lg text-on-surface-variant">Loading…</p>
      ) : status === "error" && !data ? (
        <Notice tone="error">{error.message}</Notice>
      ) : (
        <ul className="space-y-3">
          {shown.map((record) => (
            <li key={record._id}>
              <Card className="!p-4 sm:!p-5">
                {editing === record._id ? (
                  <>
                    <h2 className="mb-4 text-xl font-bold text-on-surface">Edit {record.name}</h2>
                    <RecordForm
                      fields={fields}
                      initial={toForm(fields, record)}
                      submitLabel="Save changes"
                      onCancel={() => setEditing(null)}
                      onSubmit={async (body) => {
                        await api.update(record._id, body);
                        done(`Saved ${body.name ?? record.name}.`);
                      }}
                    />
                  </>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-on-surface">{record.name}</p>
                      <p className="text-base text-on-surface-variant">{describe(record)}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEditing(record._id);
                          setMessage(null);
                        }}
                      >
                        <Pencil className="size-5" aria-hidden="true" />
                        Edit
                      </Button>
                      <ConfirmButton
                        label="Delete"
                        confirmLabel={deleteWarning ?? "Yes, delete"}
                        onConfirm={async () => {
                          try {
                            await api.remove(record._id);
                            done(`Deleted ${record.name}.`);
                          } catch (err) {
                            setMessage({ tone: "error", text: err.message });
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            </li>
          ))}
          {shown.length === 0 && (
            <li className="rounded-2xl border border-dashed border-outline-variant p-6 text-lg text-on-surface-variant">
              No {plural} found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CollectionEditor;
