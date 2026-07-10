import React from "react";
import {
  FaBirthdayCake,
  FaGraduationCap,
  FaBriefcase,
  FaChartLine,
  FaMobileAlt,
  FaHeartbeat,
} from "react-icons/fa";

const services = [
  {
    id: 1,
    color: "pink",
    icon: <FaBirthdayCake />,
    heading: "Celebración de Cumpleaños",
    text: "Organizamos tu celebración para que sea inolvidable. Desde $80.000.",
    tag: "Ahorra automáticamente para tu cumpleaños",
  },
  {
    id: 2,
    color: "blue",
    icon: <FaGraduationCap />,
    heading: "Escuela de Talentos",
    text: "Desarrolla tus habilidades y monetízalas con cursos certificados.",
    tag: "Crea y vende tus propios cursos",
  },
  {
    id: 3,
    color: "purple",
    icon: <FaBriefcase />,
    heading: "Oportunidades Laborales",
    text: "Plan B: conectamos tu talento con el mercado laboral.",
    tag: "Encuentra trabajo o publica ofertas",
  },
  {
    id: 4,
    color: "teal",
    icon: <FaChartLine />,
    heading: "Potencia tu Negocio",
    text: "Transformamos y formalizamos tu emprendimiento.",
    tag: "Asesoría profesional para crecer",
  },
  {
    id: 5,
    color: "orange",
    icon: <FaMobileAlt />,
    heading: "Pégate a lo Social",
    text: "Gana dinero con TikTok, Instagram y redes sociales.",
    tag: "Monetiza tu contenido digital",
  },
  {
    id: 6,
    color: "green",
    icon: <FaHeartbeat />,
    heading: "Auditoría en Salud",
    text: "Accede al fondo solidario y gestiona tu salud.",
    tag: "Fondo de medicamentos disponible",
  },
];

const Services = () => {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section__head">
          <h2 className="section__title">Nuestros Servicios</h2>
          <p className="section__subtitle">
            Un ecosistema completo diseñado para tu crecimiento personal,
            profesional y económico.
          </p>
        </div>

        <div className="services__grid">
          {services.map((s) => (
            <article className={`card card--${s.color}`} key={s.id}>
              <div className={`card__icon card__icon--${s.color}`}>{s.icon}</div>
              <h3 className="card__title">{s.heading}</h3>
              <p className="card__text">{s.text}</p>
              <div className="card__tag">
                <span role="img" aria-label="destello">✨</span> {s.tag}
              </div>
              <a className={`card__link card__link--${s.color}`} href="https://wa.me/573157523121">
                Conocer ahora →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
