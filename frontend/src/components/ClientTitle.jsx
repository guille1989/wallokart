// src/components/TitleField.jsx
import React, { useEffect, useId, useMemo, useState } from "react";

function toTitleCase(str = "") {
  return str
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function suggestFromFilename(filename = "") {
  if (!filename) return "";
  const base = filename.replace(/\.[^.]+$/, ""); // quita extensión
  return toTitleCase(base);
}

function slugify(str = "") {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ClientTitleField({
  value,
  onChange,
  filename = "", // opcional: nombre del archivo para sugerir el título
  maxLength = 80,
  required = false,
  label,
}) {
  const id = useId();
  const [touched, setTouched] = useState(false);

  const suggestion = useMemo(() => suggestFromFilename(filename), [filename]);
  const current = value ?? "";
  const remaining = maxLength - current.length;
  const hasError = required && touched && current.trim() === "";

  useEffect(() => {
    // si el usuario borra y existe sugerencia, mantenemos el placeholder bonito
  }, [filename]);

  return (
    <div style={styles.wrap}>
      <label htmlFor={id} style={styles.label}>
        {label} {required && <span style={styles.req}>*</span>}
      </label>

      <div style={styles.row}>
        <input
          id={id}
          type="text"
          placeholder={suggestion || 'Ej: "Explorador Beacon"'}
          value={current}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          onBlur={() => setTouched(true)}
          aria-invalid={hasError}
          aria-describedby={`${id}-help ${id}-counter ${id}-slug`}
          style={{
            ...styles.input,
            borderColor: hasError ? "#e53935" : "#ddd",
          }}
        />

        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => onChange("")}
            style={styles.btnGhost}
            title="Limpiar"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div style={styles.metaRow}>
        <small id={`${id}-help`} style={styles.muted}>
          {current.trim() === "" && suggestion
            ? "Si lo dejas vacío, puedes usar la sugerencia o se usará el nombre del archivo sin extensión."
            : "Escribe un título claro y descriptivo."}
        </small>

        <small
          id={`${id}-counter`}
          style={{
            ...styles.counter,
            color: remaining < 10 ? "#e65100" : "#777",
          }}
        >
          {remaining} caract.
        </small>
      </div>

      {/* Slug 
      <div id={`${id}-slug`} style={styles.slug}>
        <small style={styles.muted}>Slug:</small>
        <code style={styles.code}>{slugify(current || suggestion)}</code>
      </div>
      */}

      {hasError && (
        <div role="alert" style={styles.error}>
          El título es obligatorio.
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: { marginBottom: 10 },
  label: { display: "block", fontWeight: 600, marginBottom: 6 },
  req: { color: "#e53935" },
  row: { display: "grid", gridTemplateColumns: "1fr auto", gap: 8 },
  input: {
    width: "100%",
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 8,
    outline: "none",
  },
  actions: { display: "flex", gap: 8, alignItems: "center" },
  btnGhost: {
    marginLeft: "25px",
    border: "1px solid #ddd",
    background: "#fff",
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnPrimary: {
    border: "1px solid #4f86ff",
    background: "#4f86ff",
    color: "#fff",
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  metaRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 6,
  },
  counter: { fontVariantNumeric: "tabular-nums" },
  muted: { color: "#777" },
  slug: {
    marginTop: 6,
    background: "#fafafa",
    border: "1px dashed #eee",
    borderRadius: 8,
    padding: "6px 10px",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  code: { fontFamily: "monospace", fontSize: 12 },
  error: {
    marginTop: 6,
    color: "#b71c1c",
    background: "#ffebee",
    border: "1px solid #ffcdd2",
    padding: "6px 10px",
    borderRadius: 8,
  },
};
