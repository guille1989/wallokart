import logo from "./logo.svg";
import "./App.css";
import facebookIcon from "./assets/img/faceIco32.png";
import instagramIcon from "./assets/img/instIco32.png";
import xIcon from "./assets/img/xIcon32.png";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

// Importar todas las páginas
import { Home, Portafolio, Tienda, Proyectos, Contacto } from "./pages";

//Importing all img from assets/img/imgCatalogo
import img01 from "./assets/img/imgCatalogo/10ExploreBeacon.jpg";
import img02 from "./assets/img/imgCatalogo/27ObjetivesArcaneOverflowing.jpg";
import img03 from "./assets/img/imgCatalogo/30ObjetivesMajesticHeights.jpg";
import img04 from "./assets/img/imgCatalogo/8ExploreMachinesofWar.jpg";

import walloArk from "./assets/img/walloArk.jpg";
import gemanSinFondo from "./assets/img/germanSinFondo.png";
import gatoPortadaAjustado from "./assets/img/gatoPortadaAjustado.jpg";

import AdminCatalogo from "./components/AdminCatalogo";
import AdminProyectos from "./components/AdminProyectos";

// Componente para la página de inicio con carrusel
const HomePage = () => {
  //const [currentSlide, setCurrentSlide] = useState(0);

  

  const slides = [
    {
      image: img01,
      title: "Explorador Bacon",
      description: "texto texto texto texto texto texto texto texto",
    },
    {
      image: img02,
      title: "Arcane Overflowing",
      description: "texto texto texto texto texto texto texto texto",
    },
    {
      image: img03,
      title: "Majestic Heights",
      description: "texto texto texto texto texto texto texto texto",
    },
    {
      image: img04,
      title: "Explora las Máquinas de Guerra",
      description: "Sumérgete en el mundo de las máquinas de guerra",
    },
  ];

  {
    /* 
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };
  

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);
  */
  }

  return (
    <main className="main-content">
      {/* Contenedor */}

      {/* Content Container */}
      <div
        className="content-container"
        style={{ backgroundImage: `url(${gatoPortadaAjustado})` }}
      >
        <div className="content-overlay">
          <div className="content-text">
            <h1 className="hero-main-title-v2">
              CREATIVIDAD
              <br />
              QUE CONSTRUYE
              <br />
              MUNDOS
            </h1>
            <h1 className="hero-main-title-v3">
              Concept Art, Illustration and World Builder
            </h1>
            <Link to="/portafolio" className="portfolio-btn">
              PORTAFOLIO
            </Link>
          </div>
          <div className="content-image">
            <img
              src={gemanSinFondo}
              alt="Arte creativo"
              className="flipped-image"
            />
          </div>
        </div>
      </div>

      {/* Hero Title Section 
      <h2>Bienvenido a WalloKart</h2>

      <div className="hero-title-section">
        <h1 className="hero-main-title">
          CREATIVIDAD
          <br />
          QUE CONSTRUYE
          <br />
          MUNDOS
        </h1>
        <p className="hero-subtitle">Arte, historias y diseño en cada trazo</p>
      </div>

      <div className="carousel-container">
        <div className="carousel">
          <div className="carousel-slide active">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
            />
            <div className="slide-content">
              <h3>{slides[currentSlide].title}</h3>
              <p>{slides[currentSlide].description}</p>
            </div>
          </div>


          <button className="carousel-btn prev-btn" onClick={prevSlide}>
            ‹
          </button>
          <button className="carousel-btn next-btn" onClick={nextSlide}>
            ›
          </button>

     
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>

      */}
    </main>
  );
};

// Componente para NavLink activo
const NavLinkItem = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li>
      <Link to={to} className={`nav-link ${isActive ? "active" : ""}`}>
        {children}
      </Link>
    </li>
  );
};

// Componente Layout principal
const Layout = ({ children }) => {
  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <Link to="/" style={{ textDecoration: "none" }}>
              <img
                src={walloArk}
                alt="WalloArk"
                style={{ width: "250px", height: "auto", marginTop: "10px" }}
              />
            </Link>
          </div>
          <nav className="nav-menu">
            <ul className="nav-list">
              <NavLinkItem to="/">Home</NavLinkItem>
              <NavLinkItem to="/portafolio">Portafolio</NavLinkItem>
              {/* 
              <NavLinkItem to="/tienda">Tienda</NavLinkItem>
              */}
              <NavLinkItem to="/proyectos">Proyectos</NavLinkItem>
              <NavLinkItem to="/contacto">Contacto</NavLinkItem>
            </ul>
          </nav>
          {/* 
          <div className="header-actions">
            <button className="search-btn">🔍</button>
            <button className="cart-btn">🛒</button>
          </div>
          */}
        </div>
      </header>

      {children}

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 WalloKart. Todos los derechos reservados.</p>
          <div className="footer-links">
            <Link to="#acercade">Acerca de</Link>
            <Link to="/contacto">Contacto</Link>
            <a href="#privacy">Privacidad</a>
          </div>
          <div className="social-media">
            <a href="https://www.facebook.com/dr.wallok" className="social-link" title="Facebook">
              <img
                src={facebookIcon}
                alt="Facebook"
                className="social-icon-img"
              />
            </a>
            <a href="https://www.instagram.com/wallok_art" className="social-link" title="Instagram">
              <img
                src={instagramIcon}
                alt="Instagram"
                className="social-icon-img"
              />
            </a>
            {/* 
            <a href="#twitter" className="social-link" title="X (Twitter)">
              <img src={xIcon} alt="X (Twitter)" className="social-icon-img" />
            </a>
            */}
          </div>
        </div>
      </footer>

      {/* Chat Button 
      <div className="chat-widget">
        <button className="chat-btn" title="Chat con nosotros">
          <span className="chat-icon">💬</span>
        </button>
      </div>
      */}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/portafolio" element={<Portafolio />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/admingaleria" element={<AdminCatalogo />} />
          <Route path="/adminproyectos" element={<AdminProyectos />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
