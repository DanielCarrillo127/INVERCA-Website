import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import '../../src/contact.css'

const Contact = () => {
  return (
    <div className="contact" id='contact'>
      <div className="container">
        <div className="contactSection">
          <div className="row justifyConter">
            <div className="col-6">


              <div className='all'>
                <div className='contact-in'>
                  <div className='contact-map'>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.47102320401!2d-73.25267141311865!3d10.46348509747241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e8ab9bf0ca348fd%3A0x18ba250975852995!2sCl.%2021%20%2318b25%2C%20Valledupar%2C%20Cesar!5e0!3m2!1ses!2sco!4v1619410893003!5m2!1ses!2sco" width="100%" height="auto" allowfullscreen="" loading="lazy"></iframe>

                  </div>
                  <div className='contact-form'>
                    <h1>Contactanos</h1>
                    <form>
                      <input type='text' placeholder='Nombre' className='contact-form-txt' />
                      <input type='text' placeholder='Email' className='contact-form-txt'/>
                      <textarea placeholder='mensaje-asesoria' className='contact-form-textarea'></textarea>
                      <input type='submit' name='submit' className='contact-form-btn' />
                    </form>
                  </div>
                </div>

              </div>


              <div className='container_namefooter'>
                <img src="/images/logo.png" width='50' height='35' alt="logo" /> INVERCA
              </div>
              <p>
                La empresa se basa en la honestidad, el respeto mutuo, el trabajo en equipo, la responsabilidad, el profesionalismo, la transparencia en las acciones, el compromiso, el crecimiento, la innovación constante y la importancia de nuestros clientes para la vitalidad de la empresa.
              </p>
              <ul className="contactCircles">
                <li>
                  <FaFacebookF className="contactIcon" />
                </li>
                <li>
                  <FaTwitter className="contactIcon" />
                </li>
                <li>
                  <FaInstagram className="contactIcon" />
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
  );
};

export default Contact;
