import React from "react";
import "./Privacidad.css";

const Privacidad = () => (
  <div className="privacidad-page">
    <div className="container">
      <header className="page-header">
        <h1>Política de Privacidad</h1>
        <p>Tu privacidad es importante para nosotros. Aquí te explicamos cómo se recopila, usa y protege tu información en Wallokart.</p>
      </header>
      <section className="privacy-content">
        <h2>Recopilación de información</h2>
        <p>
          Solo recopilamos la información personal que tú nos proporcionas voluntariamente a través de formularios de contacto, suscripción o interacción con el sitio.
        </p>
        <h2>Uso de la información</h2>
        <p>
          Utilizamos tus datos únicamente para responder consultas, mejorar la experiencia del usuario y, si lo autorizas, enviarte información relevante sobre nuestros servicios o novedades.
        </p>
        <h2>Protección de datos</h2>
        <p>
          Implementamos medidas de seguridad para proteger tu información personal y evitar accesos no autorizados.
        </p>
        {/* 
        <h2>Cookies</h2>
        <p>
          Este sitio puede utilizar cookies para mejorar la navegación. Puedes desactivarlas en la configuración de tu navegador.
        </p>
        */}
        <h2>Terceros</h2>
        <p>
          No compartimos tu información personal con terceros, salvo obligación legal o para prestar servicios solicitados por ti.
        </p>
        <h2>Contacto</h2>
        <p>
          Si tienes dudas sobre nuestra política de privacidad, puedes contactarnos desde la página de contacto.
        </p>
      </section>
    </div>
  </div>
);

export default Privacidad;
