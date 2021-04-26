import React from "react";

const Prices = () => {
  const [header] = React.useState({
    mainHeader: "ESCOGE Y VISITA ALGUNO DE NUESTROS PRODUCTOS ",
    subHeading: "Portafolio",
    text:
      "Conoce aquí nuestro actual portafolio de productos, con nuestras diversas propuestas. ",
  });
  const [state] = React.useState([
    {
      id: 1,
      heading: "App Móvil",
      heading2: 'TURIZCAM',
      img: "/images/LogoName.svg",
      msg1: "Es un sistema interactivo para visitar lugares turísticos mientras juegas, te diviertes y además de todo eso ganas premios exclusivos. ven y Pruébalo por ti mismo",
      alt: 'Turizcam',
      width:'270',
      height:'270',
      url:'/'
    },
    {
      id: 2,
      heading: "Servicio Inmobiliario",
      heading2: 'Bienes Raíces',
      img: "/images/brand_1.png",
      msg1: "Un Portal Web en Colombia dedicado a la asesoría del mercado de Bienes Raíces. Encuentra con nosotros anuncios clasificados de Constructoras, Inmobiliarias e inmuebles propias para la venta o arriendo.",
      alt: 'Inmobiliario',
      width:'320',
      height:'250',
      url:'/'
    },
    {
      id: 3,
      heading: "RESERVA NATURAL ",
      heading2: 'JACOBO CARRILLO',
      img: "/images/reserva1.png",
      msg1: "Tenemos un proyecto eco ambiental de responsabilidad social para mitigar el impacto negativo, con conciencia ambiental a través de la implementación de espacios para reestablecer la flora y la fauna.",
      alt: 'Reserva_natural',
      width:'250',
      height:'250',
      url:'/'
    },
  ]);
  return (
    <div className="prices" id='prices'>
      <div className="container">
        <div className="common">
          <h3 className="heading">{header.mainHeader}</h3>
          <h1 className="mainHeader">{header.subHeading}</h1>
          <p className="mainContent">{header.text}</p>
          <div className="commonBorder"></div>
        </div>
        <div className="row">
          {state.map((portafolio) => (
            <div className="col-4" key={portafolio.id}>
              <div className="price">
                <div className="priceHeading">{portafolio.heading}</div>
                <div className="price__rs">
                  {portafolio.heading2}
                </div>
                <ul>
                  <li>
                    <img src={portafolio.img} width={portafolio.width} height={portafolio.height} alt = {portafolio.alt}></img>
                  </li>
                  <li>{portafolio.msg1}</li>
                </ul>
                <div className="price__btn">
                  <a href={portafolio.url} className="btn btn-outline">
                    Saber Mas
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Prices;
