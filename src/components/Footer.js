import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import '../../src/contact.css'

const Footer = () => {
  return (
    <div className="contact2" id='contact'>
      <div className="container">
        <div className="contactSection">
          <div className="row justifyConter">
            <div className="col-6">
              <div className='footer'>
                <div className='container_namefooter'>
                  <img src="/images/logo.png" width='50' height='35' alt="logo" /> INVERCA
                </div>
                <p>
                  La empresa se basa en la honestidad, el respeto mutuo, el trabajo en equipo, la responsabilidad, el profesionalismo, la transparencia en las acciones, el compromiso, el crecimiento, la innovación constante y la importancia de nuestros clientes para la vitalidad de la empresa.
                </p>
                <ul className="contactCircles">
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
                <div className='copy'>
                  Copyright © 2020 All Rights Reserved by INVERCA.CO
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;