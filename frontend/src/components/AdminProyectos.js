import React, { useState, useEffect } from "react";
import Uploader from "./Uploader";
import Galeria from "./Galeria";
import CategoryMultiSelect from "../components/CategoryMultiSelect";
import TecnologiasMultiSelect from "../components/TecnologiasMultiselect";
import TitleField from "../components/TitleField";
import DescriptionField from "../components/DescriptionField";
import AnnioField from "../components/AnnioField";

// Si en CRA configuraste proxy a 3001, puedes dejar API_BASE = '' y usar rutas relativas.
const API_BASE = process.env.REACT_APP_API_BASE || ""; // ej: http://localhost:3001
const DEFAULT_PREFIX = process.env.REACT_APP_S3_PREFIX || "proyecto/";
const MAX_KEYS = Number(process.env.REACT_APP_MAX_KEYS || 60);
// Si tu bucket es privado y aún no usas CloudFront, pon REACT_APP_SIGNED_URLS=true para que el backend devuelva URLs firmadas temporales.
const SIGNED = String(process.env.REACT_APP_SIGNED_URLS || "false");

function filenameFromKey(key) {
  try {
    const parts = key.split("/");
    return decodeURIComponent(parts[parts.length - 1]);
  } catch {
    return key;
  }
}

//Componente para gestionar el ingreso de proyectos
export default function AdminProyectos() {
  const [items, setItems] = useState([]); // [{ id, key, url, title, description, category }]
  const [prefix, setPrefix] = useState(DEFAULT_PREFIX);
  const [nextToken, setNextToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  // ---- Formulario de metadata para las próximas subidas ----
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [annio, setAnnio] = useState("2025");
  const [category, setCategory] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [description, setDescription] = useState("");

  // Carga inicial por prefijo (S3) y enriquecimiento con Mongo
  useEffect(() => {
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix]);

  // --- Helpers API ---
  async function fetchPage(token = null) {
    const qs = new URLSearchParams({
      prefix,
      maxKeys: String(MAX_KEYS),
      signed: SIGNED,
    });
    if (token) qs.set("token", token);

    const res = await fetch(`${API_BASE}/api/list-proyectos?` + qs.toString());
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Listado falló (${res.status}): ${t}`);
    }
    return res.json(); // { items: [{key,url,size,lastModified,etag}], nextToken, ... }
  }

  // Trae metadata desde Mongo y la aplica a la lista (match por s3Key)
  async function mergeMongoMeta(baseItems) {
    try {
      const res = await fetch(`${API_BASE}/api/list-mongo/proyectos`);
      if (!res.ok) return baseItems;
      const data = await res.json();
      const byKey = new Map((data || []).map((d) => [d.s3Key, d]));
      return baseItems.map((it) => {
        const m = byKey.get(it.key);
        return m
          ? {
              ...it,
              title: m.title || it.title || it.name,
              description: m.description || it.description || "",
              category: m.category || it.category,
              technologies: m.technologies || it.technologies,
              url: m.image || it.url,
            }
          : it;
      });
    } catch {
      return baseItems;
    }
  }

  async function loadFirstPage() {
    try {
      setError("");
      setLoading(true);
      const data = await fetchPage(null);
      let mapped = (data.items || []).map((o) => ({
        id: o.key, // puedes cambiar a crypto.randomUUID()
        name: filenameFromKey(o.key),
        title: filenameFromKey(o.key),
        description: "", // se completará desde Mongo si existe
        category: "", // se completará desde Mongo si existe
        technologies: "", // se completará desde Mongo si existe
        key: o.key,
        url: o.url,
      }));
      mapped = await mergeMongoMeta(mapped);
      setItems(mapped);
      setNextToken(data.nextToken || null);
    } catch (e) {
      setError(e.message || "No se pudo cargar el catálogo");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!nextToken) return;
    try {
      setLoadingMore(true);
      const data = await fetchPage(nextToken);
      let mapped = (data.items || []).map((o) => ({
        id: o.key,
        name: filenameFromKey(o.key),
        title: filenameFromKey(o.key),
        description: "",
        category: "",
        key: o.key,
        url: o.url,
      }));
      mapped = await mergeMongoMeta(mapped);
      setItems((prev) => [...prev, ...mapped]);
      setNextToken(data.nextToken || null);
    } catch (e) {
      setError(e.message || "No se pudo cargar más");
    } finally {
      setLoadingMore(false);
    }
  }

  // Guardar metadata en Mongo tras subir
  async function saveImageMeta({
    key,
    chosenTitle,
    chosenCategory,
    chosenDescription,
    chosenTechnologies,
    chosenClient,
    type,
    size,
  }) {
    const body = {
      key, // s3Key
      title: chosenTitle,
      category: chosenCategory,
      description: chosenDescription,
      technologies: chosenTechnologies,
      client: chosenClient,
      mime: type,
      size,
      annio,
    };
    const res = await fetch(`${API_BASE}/api/proyectos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("No se pudo guardar metadata");
    return res.json();
  }

  // Llamado por Uploader cuando finaliza una subida
  async function handleUploaded({ key, url, name, type, size }) {
    const chosenTitle = (title || "").trim() || name.replace(/\.[^.]+$/, "");
    const chosenClient = (client || "").trim();
    const chosenCategory = category.length ? category : [];
    const chosenTechnologies = technologies.length ? technologies : [];
    const chosenDescription = (description || "").trim();

    // pinta en UI inmediatamente con los valores del formulario
    setItems((prev) => [
      {
        id: crypto.randomUUID(),
        name: chosenTitle,
        title: chosenTitle,
        client: chosenClient,
        description: chosenDescription,
        category: chosenCategory,
        technologies: chosenTechnologies,
        key,
        url,
      },
      ...prev,
    ]);

    // guarda en Mongo (no bloquea la UI) y sincroniza si el backend devuelve campos “oficiales”
    try {
      const saved = await saveImageMeta({
        key,
        chosenTitle,
        chosenCategory,
        chosenDescription,
        chosenTechnologies,
        chosenClient,
        type,
        size,
      });
      setItems((prev) =>
        prev.map((it) =>
          it.key === key
            ? {
                ...it,
                id: saved.id ?? it.id,
                url: saved.image || it.url,
                title: saved.title || it.title,
                description: saved.description ?? it.description,
                category: saved.category || it.category,
                technologies: saved.technologies || it.technologies,
                client: saved.client || it.client,
              }
            : it
        )
      );
    } catch (e) {
      console.error(e);
      // opcional: marcar item con error o mostrar toast
    }
  }

  async function handleDelete(item) {
    console.log("handleDelete", item);
    const key = item.key; // asegúrate de tener key (s3Key) en items
    if (!key) return alert("No tengo la clave S3 del elemento.");
    const ok = window.confirm(`¿Eliminar la imagen?\n${key}`);
    if (!ok) return;

    const res = await fetch(
      `${API_BASE}/api/proyectos/by-key?key=${encodeURIComponent(
        key
      )}&invalidate=true`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      alert(`No se pudo eliminar: ${t}`);
      return;
    }
    // Optimista: quitar de la UI
    setItems((prev) => prev.filter((x) => x.key !== key));
  }

  return (
    <section style={{ width: "50%", margin: "0 auto" }}>
      <h1>Proyectos</h1>

      {/* --- Formulario de metadata que se aplicará a las próximas subidas --- */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: 12,
          border: "1px solid #eee",
          borderRadius: 12,
          marginBottom: 16,
          width: "100%",
        }}
      >
        <div>
          <TitleField
            value={title}
            onChange={setTitle}
            maxLength={80}
            required
            label={"Nombre del proyecto"}
          />
        </div>

        <div>
          <TitleField
            value={client}
            onChange={setClient}
            maxLength={80}
            required
            label={"Nombre del cliente"}
            placeholderSuggestion={"Ej: \"Cliente XYZ\""}
          />
        </div>

        <AnnioField value={annio} onChange={setAnnio} />

        <div style={{ gridColumn: "1 / -1" }}>
          <CategoryMultiSelect value={category} onChange={setCategory} />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <TecnologiasMultiSelect
            value={technologies}
            onChange={setTechnologies}
          />
        </div>

        <div>
          <DescriptionField
            value={description}
            onChange={setDescription}
            required
            maxLength={300}
            minLength={10}
            placeholder={"Descripción del proyecto.."}
          />
        </div>
      </div>

      {/* Selector de "carpeta" (prefijo) + refresco del listado S3 
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <label>Prefijo:</label>
            <input
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="catalogo/2025-08-21/"
              style={{ flex: 1, padding: 8 }}
            />
            <button onClick={loadFirstPage}>Refrescar</button>
          </div>
          */}

      <Uploader
        multiple
        onUploaded={handleUploaded}
        folder={"proyecto"}
        flagPresign={"presign-proyecto"}
      />

      <h2 style={{ marginTop: 24 }}>Proyectos</h2>

      {loading && <p>Cargando…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && <Galeria items={items} onDelete={handleDelete} />}

      <div style={{ marginTop: 16 }}>
        {nextToken ? (
          <button onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? "Cargando…" : "Cargar más"}
          </button>
        ) : (
          !loading && items.length > 0 && <small>No hay más resultados</small>
        )}
      </div>
    </section>
  );
}
