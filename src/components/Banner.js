import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPlay,
} from "react-icons/fa";
const Banner = () => {
  const [state] = React.useState({
    title: "INVERCA.CO",
    text:
      "Somos una entidad con un amplio portafolio de servicios Inmobiliarios (Finca Raíz), con generacion de empleo y proyectos de  turismo sostenible.​",
    image: "/images/sec-1.svg",
  });
  return (
    <header className="header" id='header'>
      <div className="container">
        <div className="row">
          <div className="col-6">
            <div className="header__content">
              <div className="header__section">
                <ul className="header__ul">
                  <li>
                    <a className='aclass' href='https://www.facebook.com/coomsocial.org' alt='FacebookUrl'>
                      <FaFacebookF className="headerIcon" />
                    </a>
                  </li>
                  <li>
                    <a className='aclass' href='https://twitter.com/coomsocial' alt='TwitterUrl'>
                      <FaTwitter className="headerIcon" />
                    </a>
                  </li>
                  <li>
                    <a className='aclass' href='https://www.instagram.com/inverca1998/' alt='InstaUrl'>
                      <FaInstagram className="headerIcon" />
                    </a>
                  </li>
                </ul>
                <h1>{state.title}</h1>
                <p>{state.text}</p>
                <div className="header__buttons">
                  <a href="/" className="btn btn-outline">
                    UNETE YA
                  </a>
                  &nbsp;&nbsp;&nbsp;
                  <a href="/" className="btn btn-smart">
                    <FaPlay className="play" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="banner__img">
              <img src={state.image} width="800" height="500" alt="sec-1" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Banner;
