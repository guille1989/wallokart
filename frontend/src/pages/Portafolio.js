// src/pages/Portafolio.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./Portafolio.css";

const API_BASE = process.env.REACT_APP_API_BASE || ""; // ej: http://localhost:3001
const DEFAULT_PREFIX = process.env.REACT_APP_S3_PREFIX || "catalogo/";
const MAX_KEYS = Number(process.env.REACT_APP_MAX_KEYS || 60);
const SIGNED = String(process.env.REACT_APP_SIGNED_URLS || "false");

// Fallback por si tu backend no devuelve 'image'
function buildPublicUrlFromKey(key) {
  if (!key) return "";
  const cdn = process.env.REACT_APP_CDN_DOMAIN;
  const region = process.env.REACT_APP_AWS_REGION || "us-east-1";
  const bucket = process.env.REACT_APP_S3_BUCKET;
  if (cdn) return `https://${cdn}/${encodeURI(key)}`;
  if (bucket)
    return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURI(key)}`;
  return ""; // mejor hacer que el backend devuelva image
}

const Portafolio = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [portfolioItems, setPortfolioItems] = useState([]); // [{id,title,category,image,description}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prefix, setPrefix] = useState(DEFAULT_PREFIX);
  // Estado para modal de imagen
  const [modalImg, setModalImg] = useState(null);
  // Para navegación con flechas
  const [modalIdx, setModalIdx] = useState(-1);

  // Abrir modal y guardar índice
  const openModal = (item) => {
    const idx = filteredItems.findIndex((i) => i.id === item.id);
    setModalImg(item);
    setModalIdx(idx);
  };

  // Navegación modal
  const goPrev = (e) => {
    e && e.stopPropagation();
    if (modalIdx > 0) {
      const prev = filteredItems[modalIdx - 1];
      setModalImg(prev);
      setModalIdx(modalIdx - 1);
    }
  };
  const goNext = (e) => {
    e && e.stopPropagation();
    if (modalIdx < filteredItems.length - 1) {
      const next = filteredItems[modalIdx + 1];
      setModalImg(next);
      setModalIdx(modalIdx + 1);
    }
  };

  // Cerrar modal
  const closeModal = () => {
    setModalImg(null);
    setModalIdx(-1);
  };

  async function fetchPage(token = null) {
    const res = await fetch(`${API_BASE}/api/list-mongo`);
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`Listado falló (${res.status}): ${t}`);
    }
    return res.json(); // { items: [{key,url,size,lastModified,etag}], nextToken, ... }
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        // Trae todas (ajusta limit según necesites)
        const data = await fetchPage(null);
        console.log("fetchPage data=", data);

        const mapped = data.map((it) => ({
          id: it.id || it._id || it.s3Key,
          title: it.title || "Sin título",
          category: it.category || "otros",
          image: it.image || buildPublicUrlFromKey(it.s3Key),
          description: it.description || "",
        }));

        console.log("mapped items=", mapped);

        setPortfolioItems(mapped);
      } catch (e) {
        setError(e.message || "Error cargando portafolio");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Categorías dinámicas + las fijas que tenías
  const categories = useMemo(() => {
    console.log("portfolioItems", portfolioItems);
    const base = [{ id: "all", name: "Todos" }];
    // añade cualquier categoría nueva que venga de la BD
    const known = new Set(base.map((c) => c.id));
    const allCategories = portfolioItems
      .map((i) => i.category)
      .filter(Boolean)
      .flat(); // <-- aplana arrays

    const extra = Array.from(new Set(allCategories))
      .filter((c) => !known.has(c))
      .map((c) => ({ id: c, name: c }));
    return [...base, ...extra];
  }, [portfolioItems]);

  const filteredItems =
    selectedCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) =>
          Array.isArray(item.category)
            ? item.category.includes(selectedCategory)
            : item.category === selectedCategory
        );

  return (
    <div className="portafolio-page">
      <div className="container">
        <header className="page-header">
          <h1>Mi Portafolio</h1>
          <p>Una colección de mis mejores trabajos de arte digital</p>
        </header>

        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading && <p>Cargando…</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {!loading && !error && (
          <>
            <div className="portfolio-grid">
              {filteredItems.map((item) => (
                <div key={item.id} className="portfolio-item">
                  <div className="portfolio-image" onClick={() => openModal(item)} style={{cursor:'zoom-in'}}>
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <div className="portfolio-overlay">
                      <h3>{item.title}</h3>
                      <p>{item.description || "Sin descripción"}</p>

                      <div className="category-tags">
                        {item.category.map((catId) => (
                          <span key={catId} className="category">
                            {catId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <p>No hay elementos en esta categoría.</p>
              )}
            </div>
            {/* Modal para imagen ampliada */}
            {modalImg && (
              <div className="modal-img-bg" onClick={closeModal}>
                <div className="modal-img-content" onClick={e => e.stopPropagation()}>
                  {/* Flecha izquierda 
                  {modalIdx > 0 && (
                    <button className="modal-img-arrow left" onClick={goPrev} title="Anterior" aria-label="Anterior">&#8592;</button>
                  )}*/}
                  <img src={modalImg.image} alt={modalImg.title} />
                  {/* Flecha derecha 
                  {modalIdx < filteredItems.length - 1 && (
                    <button className="modal-img-arrow right" onClick={goNext} title="Siguiente" aria-label="Siguiente">&#8594;</button>
                  )}*/}
                  <div className="modal-img-caption">
                    <h3>{modalImg.title}</h3>
                    <p>{modalImg.description}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Portafolio;
