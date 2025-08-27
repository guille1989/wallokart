import React, { useEffect, useMemo, useState } from "react";
import "./Proyectos.css";

const API_BASE = process.env.REACT_APP_API_BASE || ""; // ej: http://localhost:3001
const DEFAULT_PREFIX = process.env.REACT_APP_S3_PREFIX || "proyecto/";
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

const Proyectos = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [portfolioItems, setPortfolioItems] = useState([]); // [{id,title,category,image,description}]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prefix, setPrefix] = useState(DEFAULT_PREFIX);

  async function fetchPage(token = null) {
    const res = await fetch(`${API_BASE}/api/list-mongo/proyectos`);
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
          technologies: it.technologies || [],
          annio: it.annio || "2024",
          client: it.client || "Sin cliente",
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
  const projects = useMemo(() => {
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
    <div className="proyectos-page">
      <div className="container">
        <header className="page-header">
          <h1>Proyectos</h1>
          <p>
            Una selección de mis trabajos más destacados y colaboraciones
            profesionales
          </p>
        </header>

        <div className="projects-container">
          {filteredItems.map((project, index) => (
            <div
              key={project.id}
              className={`project-item ${index % 2 === 1 ? "reverse" : ""}`}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-content">
                <div className="project-meta">
                  <span className="category">{project.category}</span>
                  <span className="year">{project.annio}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="client">Cliente: {project.client}</p>
                <p className="description">{project.description}</p>
                <div className="technologies">
                  <h4>Tecnologías utilizadas:</h4>
                  <div className="tech-tags">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                {project.link && (
                  <a href={project.link} className="project-link">
                    Ver Proyecto →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Proyectos;
