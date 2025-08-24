// src/components/Galeria.js
import React from "react";

export default function Galeria({ items = [], onDelete }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
      {items.map((it) => (
        <figure key={it.id || it.key} style={{ margin: 0, border: "1px solid #eee", borderRadius: 12, overflow: "hidden", position: "relative" }}>
          <img src={it.url || it.image} alt={it.title || it.name} loading="lazy"
               style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
          <figcaption style={{ padding: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{it.title || it.name}</div>
            <p style={{ margin: 0, color: "#555", lineHeight: 1.35 }}>
              {it.description || "Sin descripción"}
            </p>
          </figcaption>

          <button
            onClick={() => onDelete?.(it)}
            style={{
              position: "absolute", top: 8, right: 8, border: "none",
              background: "crimson", color: "#fff", padding: "6px 10px",
              borderRadius: 8, cursor: "pointer"
            }}
            title="Eliminar"
          >
            Eliminar
          </button>
        </figure>
      ))}
    </div>
  );
}
