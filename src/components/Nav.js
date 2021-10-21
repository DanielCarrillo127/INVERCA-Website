import React from "react";
import { FaAlignJustify } from "react-icons/fa";
import { Link } from 'react-scroll';
import { animateScroll as scroll } from 'react-scroll';



const Nav = () => {

  const [state, setState] = React.useState(true);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar__container">
          <ul className="navbar__left">
            <div className='container_name'>
              <Link onClick={() => scroll.scrollToTop()}>
                <img src="/images/logo.png" width='50' height='35' alt="logo" /> INVERCA
              </Link>
            </div>
          </ul>
          { state === true ? (
            <ul className="navbar__right">
              <li>
                <Link to="header" smooth={true} duration={1000} >Inicio</Link>
              </li>
              <li>
                <Link to="services" smooth={true} duration={1000} >Servicios</Link>
              </li>
              <li>
                <Link to="about" smooth={true} duration={1000} >Conocenos</Link>
              </li>
              <li>
                <Link to="prices" smooth={true} duration={1000} >Portafolio</Link>
              </li>
              <li>
                <Link to="contact" smooth={true} duration={1000}>Contactanos</Link>
              </li>
            </ul>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="toggle" onClick={() => setState(!state)}>
        <FaAlignJustify />
      </div>
    </nav>
  );
};

export default Nav;
