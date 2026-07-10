import React from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    id: 1,
    title: "Regístrate Gratis",
    text: "Crea tu cuenta en 30 segundos. Obtén tu código de referido y comienza a invitar amigos.",
  },
  {
    id: 2,
    title: "Invita y Participa",
    text: "Comparte tu código, organiza tu cumpleaños, toma cursos, usa nuestros servicios y gana dinero.",
  },
  {
    id: 3,
    title: "Retira tus Ganancias",
    text: "Los primeros 5 días de cada mes, retira tus ganancias directamente a tu cuenta.",
  },
];

const HowItWorks = () => {
  return (
    <section className="how" id="how">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">¿Cómo Funciona?</h2>
          <p className="section__subtitle">
            Comenzar en COOMSOCIAL es fácil. Sigue estos 3 pasos:
          </p>
        </div>

        <div className="how__grid">
          {steps.map((s) => (
            <div className="how__step" key={s.id}>
              <div className="how__num">{s.id}</div>
              <h3 className="how__title">{s.title}</h3>
              <p className="how__text">{s.text}</p>
            </div>
          ))}
        </div>

        <div className="how__cta">
          <Link className="btn btn-primary" to="/registro">
            Únete Gratis Ahora
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
