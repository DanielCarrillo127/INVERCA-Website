import React from "react";
import { FaUserPlus, FaWhatsapp, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";

const checks = [
  "Ingresos desde el primer día",
  "Cumpleaños desde $80.000",
  "Retiros los primeros 5 días",
];

const Hero = () => {
  return (
    <header className="hero" id="hero">
      <div className="hero__glow hero__glow--1" />
      <div className="hero__glow hero__glow--2" />
      <div className="container hero__content">
        <img
          className="hero__logo"
          src="/images/coomsocial-isotipo.png"
          alt="COOMSOCIAL"
        />
        <h1 className="hero__title">COOMSOCIAL</h1>
        <p className="hero__subtitle">Tu Oportunidad de Crecer</p>
        <p className="hero__text">
          Celebra tu cumpleaños, desarrolla tu talento, potencia tu negocio y
          genera ingresos desde el primer día.
        </p>

        <div className="hero__buttons">
          <RouterLink className="btn btn-primary" to="/registro">
            <FaUserPlus /> Únete Gratis Ahora
          </RouterLink>
          <a
            className="btn btn-outline"
            href="https://wa.me/573157523121"
          >
            <FaWhatsapp /> Más Información por WhatsApp
          </a>
        </div>

        <ul className="hero__checks">
          {checks.map((c) => (
            <li key={c}>
              <FaCheckCircle /> {c}
            </li>
          ))}
        </ul>

        <Link className="hero__scroll" to="services" smooth={true} duration={700} offset={-90}>
          Descubre más ↓
        </Link>
      </div>
    </header>
  );
};

export default Hero;
