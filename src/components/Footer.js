import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const socials = [
  { icon: <FaFacebookF />, url: "https://www.facebook.com/coomsocial.org", label: "Facebook" },
  { icon: <FaInstagram />, url: "https://www.instagram.com/coomsocial", label: "Instagram" },
  { icon: <SiTiktok />, url: "https://www.tiktok.com/@coomsocial", label: "TikTok" },
  { icon: <FaYoutube />, url: "https://www.youtube.com/@coomsocial", label: "YouTube" },
];

const servicios = [
  "Celebración de Cumpleaños",
  "Escuela de Talentos",
  "Potencia tu Negocio",
  "Pégate a lo Social",
];

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__grid">
        <div className="footer__col">
          <div className="footer__brand">
            <img src="/images/coomsocial-isotipo.png" alt="COOMSOCIAL" />
            <span>COOMSOCIAL</span>
          </div>
          <p className="footer__desc">
            Cooperativa Multiactiva para el Desarrollo Social.
          </p>
          <p className="footer__nit">NIT: 824.006.370-7</p>

          <h4 className="footer__heading">Contacto</h4>
          <ul className="footer__contact">
            <li>
              <FaPhoneAlt /> <a href="tel:+573157523121">+57 315 752 3121</a>
            </li>
            <li>
              <FaEnvelope />{" "}
              <a href="mailto:coomsocial1@hotmail.com">coomsocial1@hotmail.com</a>
            </li>
          </ul>

          <h4 className="footer__heading">Síguenos</h4>
          <ul className="footer__socials">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.url} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Servicios</h4>
          <ul className="footer__list">
            {servicios.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">
            <FaMapMarkerAlt /> Ubicación
          </h4>
          <p className="footer__address">Cra 18E No. 21-03, Valledupar, Cesar</p>
          <div className="footer__map">
            <iframe
              title="Ubicación COOMSOCIAL"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.47102320401!2d-73.25267141311865!3d10.46348509747241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e8ab9bf0ca348fd%3A0x18ba250975852995!2sValledupar%2C%20Cesar!5e0!3m2!1ses!2sco!4v1619410893003!5m2!1ses!2sco"
              loading="lazy"
              allowFullScreen=""
            ></iframe>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        © {new Date().getFullYear()} COOMSOCIAL. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
