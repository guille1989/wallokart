import React from "react";

export default function AnnioField({ value, onChange, min = 2000, max = new Date().getFullYear(), required = false }) {
  return (
    <div style={{ width: "100%" }}>
      <label htmlFor="annio" style={styles.label}>
        Año del proyecto {required && <span style={styles.req}>*</span>}
      </label>
      <input
        id="annio"
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={min}
        max={max}
        required={required}
        style={{
          width: "100%",
          padding: 8,
          border: "1px solid #eee",
          borderRadius: 8,
          marginBottom: 8,
          fontSize: 16,
          boxSizing: "border-box"
        }}
        placeholder="Ej: 2025"
      />
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
