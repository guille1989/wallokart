import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Bienvenido a WalloKart</h1>
          <p>Tu destino para arte digital y wallpapers únicos</p>
          <button className="cta-button">Explorar Ahora</button>
        </div>
      </section>
      
      <section className="features-section">
        <div className="container">
          <h2>¿Por qué elegir WalloKart?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Arte Original</h3>
              <p>Diseños únicos creados por artistas profesionales</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Alta Calidad</h3>
              <p>Resoluciones 4K y superiores para cualquier pantalla</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Actualizaciones</h3>
              <p>Nuevos diseños agregados regularmente</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
