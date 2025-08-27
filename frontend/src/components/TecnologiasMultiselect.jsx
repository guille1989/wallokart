// src/components/CategoryMultiSelect.jsx
import React, { useMemo, useState } from "react";

// Slugs consistentes en minúscula
const DEFAULT_OPTIONS = [
  { value: "photoshop",  label: "Photoshop" },
  { value: "illustrator", label: "Illustrator" },
  { value: "blender",      label: "Blender" },
  { value: "substance-painter",  label: "Substance Painter" }
];

export default function TecnologiasMultiSelect({
  value = [],                 // array de strings (slugs)
  onChange,
  options = DEFAULT_OPTIONS,  // puedes pasar tus propias opciones si quieres
  placeholder = "Buscar tecnología…",
  label = "Tecnologías",
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(t) ||
        o.value.toLowerCase().includes(t)
    );
  }, [q, options]);

  const selectedSet = useMemo(() => new Set(value), [value]);

  function toggle(val) {
    const next = new Set(selectedSet);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    onChange?.(Array.from(next));
  }

  function selectAll() {
    onChange?.(options.map((o) => o.value));
  }
  function clearAll() {
    onChange?.([]);
  }

  return (
    <fieldset style={styles.fieldset}>
      <legend style={styles.legend}>{label}</legend>

      {/* búsqueda */}
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        style={styles.search}
        aria-label="Buscar categoría"
      />

      {/* chips seleccionadas */}
      <div style={styles.chipsRow}>
        {value.length === 0 ? (
          <span style={styles.muted}>Ninguna seleccionada</span>
        ) : (
          value.map((v) => {
            const opt = options.find((o) => o.value === v);
            const text = opt?.label || v;
            return (
              <span key={v} style={styles.chip}>
                {text}
                <button
                  type="button"
                  aria-label={`Quitar ${text}`}
                  onClick={() => toggle(v)}
                  style={styles.chipX}
                >
                  ×
                </button>
              </span>
            );
          })
        )}
      </div>

      {/* acciones rápidas */}
      <div style={styles.actions}>
        <button type="button" onClick={selectAll} style={styles.btnGhost}>
          Seleccionar todo
        </button>
        <button type="button" onClick={clearAll} style={styles.btnGhost}>
          Limpiar
        </button>
        <span style={styles.muted}>
          {value.length} seleccionada(s) de {options.length}
        </span>
      </div>

      {/* lista de opciones en grid con checkboxes */}
      <ul role="listbox" aria-multiselectable="true" style={styles.grid}>
        {filtered.map((o) => {
          const checked = selectedSet.has(o.value);
          return (
            <li key={o.value} style={styles.item}>
              <label style={{ ...styles.option, ...(checked ? styles.optionOn : {}) }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(o.value)}
                  style={styles.checkbox}
                />
                <span>{o.label}</span>
              </label>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li style={styles.empty}>Sin resultados para “{q}”.</li>
        )}
      </ul>
    </fieldset>
  );
}

const styles = {
  fieldset: {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 12,
  },
  legend: { fontWeight: 600, padding: "0 6px" },
  search: {
    width: "98%",
    padding: 8,
    border: "1px solid #ddd",
    borderRadius: 8,
    marginBottom: 8,
  },
  chipsRow: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    minHeight: 36,
    marginBottom: 8,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    background: "#f3f3f3",
    borderRadius: 999,
    fontSize: 13,
  },
  chipX: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
    opacity: 0.7,
  },
  actions: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  btnGhost: {
    border: "1px solid #ddd",
    background: "#fff",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  muted: { color: "#777", fontSize: 13 },
  grid: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 8,
  },
  item: {},
  option: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #e5e5e5",
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
    userSelect: "none",
    background: "#fff",
  },
  optionOn: {
    borderColor: "#8ab4f8",
    background: "#f5f9ff",
  },
  checkbox: { accentColor: "#4f86ff" },
  empty: { color: "#999", padding: 8, gridColumn: "1 / -1" },
};
