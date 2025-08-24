import React, { useState } from 'react';
import './Tienda.css';

const Tienda = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const products = [
    {
      id: 1,
      title: "Nexus Punk Art Print Collection",
      category: "prints",
      price: "$24.99",
      image: "/api/placeholder/300/200",
      description: "Colección de 5 prints de alta calidad del proyecto Nexus Punk en formato A3"
    },
    {
      id: 2,
      title: "Cyberpunk Character Prints",
      category: "prints",
      price: "$18.99",
      image: "/api/placeholder/300/200",
      description: "Set de 3 prints de personajes cyberpunk en papel premium"
    },
    {
      id: 3,
      title: "Task Master - The Complete Artbook",
      category: "artbooks",
      price: "$39.99",
      image: "/api/placeholder/300/200",
      description: "Libro de arte completo del desarrollo de Board Games: Task Master con 120 páginas"
    },
    {
      id: 4,
      title: "Brutal Tales Odyssey Artbook",
      category: "artbooks",
      price: "$45.99",
      image: "/api/placeholder/300/200",
      description: "Artbook premium con concept art, procesos de diseño y arte final del videojuego"
    },
    {
      id: 5,
      title: "Digital Art Techniques PDF Guide",
      category: "pdfs",
      price: "$12.99",
      image: "/api/placeholder/300/200",
      description: "Guía completa en PDF sobre técnicas digitales utilizadas en mis proyectos"
    },
    {
      id: 6,
      title: "Game Art Development Process PDF",
      category: "pdfs",
      price: "$15.99",
      image: "/api/placeholder/300/200",
      description: "Documento detallado del proceso de creación de arte para videojuegos"
    },
    {
      id: 7,
      title: "Board Game Design Blueprint PDF",
      category: "pdfs",
      price: "$10.99",
      image: "/api/placeholder/300/200",
      description: "Template y guía paso a paso para diseñar juegos de mesa profesionales"
    },
    {
      id: 8,
      title: "Limited Edition Landscape Prints",
      category: "prints",
      price: "$29.99",
      image: "/api/placeholder/300/200",
      description: "Edición limitada de prints de paisajes futuristas en papel de archivo"
    },
    {
      id: 9,
      title: "WalloKart - Behind The Scenes Artbook",
      category: "artbooks",
      price: "$34.99",
      image: "/api/placeholder/300/200",
      description: "Libro que documenta el proceso creativo detrás de todos mis proyectos principales"
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'prints', name: 'Prints' },
    { id: 'artbooks', name: 'Artbooks' },
    { id: 'pdfs', name: 'PDFs' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="tienda-page">
      <div className="container">
        <header className="page-header">
          <h1>Tienda</h1>
          <p>Descubre nuestra colección de arte digital premium</p>
        </header>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.title} />
                <div className="product-overlay">
                  <button className="quick-view-btn">Vista Rápida</button>
                </div>
              </div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <div className="product-footer">
                  <span className="price">{product.price}</span>
                  <button className="add-to-cart-btn">🛒 Agregar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tienda;
