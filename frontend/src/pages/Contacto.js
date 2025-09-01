import React, { useState } from 'react';
import './Contacto.css';

const API_BASE = process.env.REACT_APP_API_BASE || "";

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/send-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'wallokart@gmail.com',
          subject: `[Contacto] ${formData.subject}`,
          text: `Nombre: ${formData.name}\nEmail: ${formData.email}\nMensaje: ${formData.message}`
        })
      });
      if (!res.ok) {
        const t = await res.text().catch(() => '');
        throw new Error(`No se pudo enviar el mensaje (${res.status}): ${t}`);
      }
      alert('¡Mensaje enviado! Te contactaremos pronto.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      alert('Error al enviar el mensaje: ' + err.message);
    }
  };

  return (
    <div className="contacto-page">
      <div className="container">
        <header className="page-header">
          <h1>Contacto</h1>
          <p>¿Tienes un proyecto en mente? ¡Hablemos!</p>
        </header>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>wallokart@gmail.com</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">📱</div>
              <h3>Teléfono</h3>
              <p>+57 (310) 400-7098</p>  
            </div>
            
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Ubicación</h3>
              <p>Popayán, Colombia</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">🕒</div>
              <h3>Horario</h3>
              <p>Lun - Vie: 9:00 - 18:00</p>
            </div>

            <div className="social-contact">
              <h3>Sígueme en redes</h3>
              <div className="social-links">
                <a href="#" className="social-btn">Facebook</a>
                <a href="#" className="social-btn">Instagram</a>
                <a href="#" className="social-btn">X</a>
              </div>
            </div>
          </div>

          {/** Formulario de contacto 
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Asunto</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Mensaje</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Enviar Mensaje
            </button>
          </form>
          */}
        </div>
      </div>
    </div>
  );
};

export default Contacto;
