import React from "react";

const About = () => {
  const [header] = React.useState({
    subHeader: "Conocenos",
    text:
      "SOLUCIONES A TU MEDIDA, PARA VIVIR MEJOR",
  });
  const [state] = React.useState([
    { id: 1, title: "Organizacion:", text: "INVERSIONES CARRILLO Y CIA LTDA" },
    { id: 2, title: "Email:", text: "Coomsocial1@gmail.com" },
    { id: 3, title: "Telefonos:", text: "+57 3002508226 / (035) 7872342" },
    { id: 4, title: "Dirección", text: "Cl. 21 #18d15, Valledupar, Cesar" },
  ]);
  return (
    <div className="about" id='about'>
      <div className="container">
        <div className="common">
          <h1 className="mainHeader">{header.subHeader}</h1>
          <p className="mainContent__about">{header.text}</p>
          <div className="commonBorder"></div>
        </div>
        <div className="row  h-650 alignCenter">
          <div className="col-6">
            <div className="about__img">
              <img src="/images/SEO_SVG.svg" alt="about-us" />
            </div>
          </div>
          <div className="col-6">
            <div className="about__info">
              <h1>Acerca de nosotros</h1>
              <div className="about__info-p1">
                <strong className='info__title'> MISION </strong>(Servir)<br/>
                Nuestra empresa brinda asistencia profesional, con respuestas rápida, precisa y eficiente, comprometida en obtener los mejores precios del mercado, bridamos un servicio a la medida, tanto para empresas, como para personas naturales que viajen por placer o negocios. Con fácil acceso a la información a través de redes on-line de comunicación.
              
              </div>
              <div className="about__info-p2">
              <strong className='info__title'> VISIÓN </strong>(Innovación)<br/>
                Promover el crecimiento sustentable de la Empresa, basado en la innovación permanente tanto en la prestación de los servicios, el acercamiento a los clientes, la calidad de la información, el asesoramiento adecuado para cada necesidad. Ser una organización flexible. 
              </div>
              <div className="info__contacts">
                <div className="row">
                  {state.map((info) => (
                    <div className="col-6">
                      <strong>{info.title}</strong>
                      <p>{info.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
