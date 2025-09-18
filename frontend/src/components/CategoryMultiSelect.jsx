// src/components/CategoryMultiSelect.jsx
import React, { useMemo, useState, useEffect } from "react";

const API_BASE = process.env.REACT_APP_API_BASE || ""; // ej: http://localhost:3001

export default function CategoryMultiSelect({
  value = [],                 // array de strings (slugs)
  onChange,
  options: optionsProp,       // puedes pasar tus propias opciones si quieres
  placeholder = "Buscar categoría…",
  label = "Categorías",
}) {
  const [q, setQ] = useState("");
  const [options, setOptions] = useState(optionsProp || []);
  const [newCat, setNewCat] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  // Obtener categorías desde el backend si no se pasan por props
  useEffect(() => {
    if (optionsProp && optionsProp.length) {
      setOptions(optionsProp);
      return;
    }
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE}/api/categories`);
        if (!res.ok) throw new Error("No se pudo cargar categorías");
        const data = await res.json();
        // data debe ser un array de objetos { value, label }
        setOptions(data);
      } catch {
        setOptions([]);
      }
    }
    fetchCategories();
  }, [optionsProp]);

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

  async function handleAddCategory(e) {
    e.preventDefault();
    setAddError("");
    const val = newCat.trim();
    if (!val) return;
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: val, label: val })
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "No se pudo agregar");
      }
      const cat = await res.json();
      setOptions((prev) => [...prev, cat]);
      setNewCat("");
    } catch (e) {
      setAddError("No se pudo agregar: " + (e.message || ""));
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteCategory(val) {
    if (!window.confirm("¿Eliminar la categoría?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/categories/${encodeURIComponent(val)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      setOptions((prev) => prev.filter((o) => o.value !== val));
      // Si estaba seleccionada, quitarla también del value
      if (selectedSet.has(val)) {
        onChange?.(value.filter((v) => v !== val));
      }
    } catch (e) {
      alert("No se pudo eliminar la categoría");
    }
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

      {/* Agregar nueva categoría */}
      <form onSubmit={handleAddCategory} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          type="text"
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          placeholder="Agregar nueva categoría"
          style={{ ...styles.search, marginBottom: 0, flex: 1 }}
          disabled={adding}
        />
        <button type="submit" style={styles.btnGhost} disabled={adding || !newCat.trim()}>
          {adding ? "Agregando..." : "Agregar"}
        </button>
      </form>
      {addError && <div style={{ color: "crimson", fontSize: 13, marginBottom: 8 }}>{addError}</div>}

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

      {/* lista de opciones en grid con checkboxes y botón eliminar */}
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
                <button
                  type="button"
                  aria-label={`Eliminar ${o.label}`}
                  onClick={e => { e.stopPropagation(); handleDeleteCategory(o.value); }}
                  style={{ ...styles.chipX, marginLeft: 8, color: "crimson", fontWeight: 700 }}
                  title="Eliminar categoría"
                >
                  🗑️
                </button>
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
