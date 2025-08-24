import React from 'react';
import './Proyectos.css';

const Proyectos = () => {
  const projects = [
    {
      id: 1,
      title: "Nexus Punk: Brutal Tales Odyssey",
      client: "Indie Game Studio",
      year: "2024",
      category: "Game Art Design",
      image: "/api/placeholder/500/300",
      description: "Desarrollo completo de arte conceptual y assets visuales para videojuego cyberpunk. Incluye diseño de personajes, ambientes urbanos futuristas, interfaces de usuario y elementos narrativos visuales que sumergen al jugador en un mundo distópico lleno de tecnología y rebeldía.",
      technologies: ["Photoshop", "Illustrator", "Blender", "Substance Painter"],
      link: "#"
    },
    {
      id: 2,
      title: "Board Games: Task Master",
      client: "Tabletop Publishing Co.",
      year: "2024",
      category: "Board Game Design",
      image: "/api/placeholder/500/300",
      description: "Diseño integral de juego de mesa estratégico incluyendo tablero, cartas, fichas, manual de instrucciones y packaging. Desarrollo de sistema visual cohesivo que facilita la comprensión de mecánicas complejas mientras mantiene una estética atractiva y profesional.",
      technologies: ["Adobe InDesign", "Illustrator", "Photoshop", "3D Modeling"],
      link: "#"
    }
  ];

  return (
    <div className="proyectos-page">
      <div className="container">
        <header className="page-header">
          <h1>Proyectos</h1>
          <p>Una selección de mis trabajos más destacados y colaboraciones profesionales</p>
        </header>

        <div className="projects-container">
          {projects.map((project, index) => (
            <div key={project.id} className={`project-item ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-content">
                <div className="project-meta">
                  <span className="category">{project.category}</span>
                  <span className="year">{project.year}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="client">Cliente: {project.client}</p>
                <p className="description">{project.description}</p>
                <div className="technologies">
                  <h4>Tecnologías utilizadas:</h4>
                  <div className="tech-tags">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
                <a href={project.link} className="project-link">
                  Ver Proyecto →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Proyectos;
