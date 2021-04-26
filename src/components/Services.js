import React from "react";
import { FcMultipleDevices,FcPhoneAndroid,FcHome,FcShop,FcBullish,FcLandscape } from "react-icons/fc";
const Services = () => {
  
  const [header] = React.useState({
    mainHeader: "SERVICIOS",
    subHeading: "Nuestros Servicios",
    text:
      "Tenemos un conjunto servicios pensados especialmente para ti, enfocados en las necesidades sociales actiuales y las oportunidades de negocios del momento",
  });

  const [state] = React.useState([
    {
      id: 1,
      icon: <FcMultipleDevices className="commonIcons" />,
      heading: "Desarrollo Web",
      text:
        "Gestionamos, desarrollamos e implementamos recursos  Web para pequeñas y medianas empresas.",
    },
    {
      id: 2,
      icon: <FcHome className="commonIcons" />,
      heading: "Servicio Inmobiliario",
      text:
        "Brindamos la oferta de bienes raíces, propias o brindamos enlaces accesibles con terceros. ",
    },
    {
      id: 3,
      icon: <FcShop className="commonIcons" />,
      heading: "red de negocios",
      text:
        "Unificamos a nuestros asociados para generar una red autosuficiente que genere ventajas en el mercado.",
    },
    {
      id: 4,
      icon: <FcPhoneAndroid className="commonIcons" />,
      heading: "Desarrollo Móvil",
      text:
        "Desarrollamos app's y ponemos en marcha tu idea de negocio digital, justo en la palma de tu mano.",
    },
    {
      id: 5,
      icon: <FcBullish className="commonIcons" />,
      heading: "Marketing Empresarial",
      text:
        "Te ayudamos a construir una imagen fuerte de tu marca y estrechar tus relaciones con los clientes.",
    },
    {
      id: 6,
      icon: <FcLandscape className="commonIcons" />,
      heading: "proyectos de turismo",
      text:
        "Creamos herramientas digitales de la mano del sector publico-privado para dinamizar  el turismo y la economia.",
    },
  ]);
  return (
    <div className="services" id='services'>
      <div className="container">
        <div className="services__header">
          <div className="common">
            <h3 className="heading">{header.mainHeader}</h3>
            <h1 className="mainHeader">{header.subHeading}</h1>
            <p className="mainContent">{header.text}</p>
            <div className="commonBorder"></div>
          </div>

          <div className="row bgMain">

            {state.map((info) => (
              <div className="col-4 bgMain">
                <div className="services__box">
                  {info.icon}
                  <div className="services__box-header">{info.heading}</div>
                  <div className="services__box-p">{info.text}</div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
