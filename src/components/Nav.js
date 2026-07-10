import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, animateScroll as scroll } from "react-scroll";
import { Link as RouterLink } from "react-router-dom";

const links = [
  { to: "hero", label: "Inicio" },
  { to: "services", label: "Servicios" },
  { to: "stats", label: "Logros" },
  { to: "how", label: "Cómo Funciona" },
  { to: "footer", label: "Contacto" },
];

const Nav = () => {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <div className="container navbar__container">
        <div
          className="navbar__brand"
          onClick={() => {
            scroll.scrollToTop();
            close();
          }}
        >
          <img src="/images/coomsocial-isotipo.png" alt="COOMSOCIAL" />
          <span>COOMSOCIAL</span>
        </div>

        <ul className={open ? "navbar__links navbar__links--open" : "navbar__links"}>
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} smooth={true} duration={700} offset={-90} onClick={close}>
                {l.label}
              </Link>
            </li>
          ))}
          <li className="navbar__links-cta">
            <RouterLink className="btn btn-ghost" to="/registro" onClick={close}>
              Únete Ahora
            </RouterLink>
          </li>
        </ul>

        <button
          className="navbar__toggle"
          aria-label="Menú"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Nav;
