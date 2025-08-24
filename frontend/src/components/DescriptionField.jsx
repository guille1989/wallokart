import React, { useEffect, useId, useMemo, useRef, useState } from "react";

export default function DescriptionField({
  value,
  onChange,
  label = "Descripción",
  placeholder = "Descripción: Arte conceptual para....",
  maxLength = 300,
  minLength = 0,
  required = false,
  rows = 3,
  style,
}) {
  const id = useId();
  const taRef = useRef(null);
  const [touched, setTouched] = useState(false);
  const text = value ?? "";

  // auto-resize
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 400) + "px"; // máx 400px
  }, [text]);

  const remaining = maxLength - text.length;
  const words = useMemo(() => (text.trim() ? text.trim().split(/\s+/).length : 0), [text]);
  const hasError =
    (required && touched && text.trim() === "") ||
    (minLength > 0 && touched && text.trim().length < minLength);

  function insertTemplate() {
    const tpl =
      "Arte conceptual para ambientes de exploración. Técnicas: digital painting y photobashing. Enfoque en iluminación, atmósfera y composición.";
    onChange?.((text ? text + (text.endsWith("\n") ? "" : "\n") : "") + tpl);
  }

  return (
    <div style={{ gridColumn: "1 / -1", ...style }}>
      <label htmlFor={id} style={{ display: "block", fontWeight: 600 }}>
        {label} {required && <span style={{ color: "#e53935" }}>*</span>}
      </label>

      <textarea
        id={id}
        ref={taRef}
        placeholder={placeholder}
        value={text}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        onBlur={() => setTouched(true)}
        rows={rows}
        aria-invalid={hasError}
        aria-describedby={`${id}-help ${id}-counter`}
        style={{
          width: "97%",
          padding: 10,
          marginTop: 4,
          resize: "none",
          border: "1px solid " + (hasError ? "#e53935" : "#ddd"),
          borderRadius: 8,
          outline: "none",
          lineHeight: 1.5,
        }}
      />

      {/* acciones rápidas */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
        <button
          type="button"
          onClick={() => onChange("")}
          style={btnGhost}
          title="Limpiar"
        >
          Limpiar
        </button>
        <button
          type="button"
          onClick={insertTemplate}
          style={btnGhost}
          title="Insertar plantilla"
        >
          Insertar plantilla
        </button>

        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "baseline" }}>
          <small id={`${id}-counter`} style={{ color: remaining < 20 ? "#e65100" : "#777" }}>
            {words} palabra{words === 1 ? "" : "s"} · {remaining} caract. restantes
          </small>
        </div>
      </div>

      <small id={`${id}-help`} style={{ color: "#777", display: "block", marginTop: 4 }}>
        Sé claro y específico. {minLength > 0 ? `Mínimo ${minLength} caracteres. ` : ""}Máximo {maxLength}.
      </small>

      {hasError && (
        <div role="alert" style={errorBox}>
          {text.trim() === ""
            ? "La descripción es obligatoria."
            : `La descripción debe tener al menos ${minLength} caracteres.`}
        </div>
      )}
    </div>
  );
}

const btnGhost = {
  border: "1px solid #ddd",
  background: "#fff",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
};

const errorBox = {
  marginTop: 6,
  color: "#b71c1c",
  background: "#ffebee",
  border: "1px solid #ffcdd2",
  padding: "6px 10px",
  borderRadius: 8,
};
