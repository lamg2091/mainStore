import "../styles/Contacto.css";
import { Link } from "react-router-dom";

const Contacto = () => {
  return (
    <>
      <main className="container-contacto">
        <header className="contacto">
          <h3>Mándanos un mensaje para contactarnos</h3>
          <h4>Mein-store</h4>
        </header>

        <div className="container-formulario">
          <form action="">
            <div className="group-input">
              <label htmlFor="name">Nombre</label>
              <input type="text" id="name" name="name" />
            </div>

            <div className="group-input">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" />
            </div>

            <div className="group-input">
              <label htmlFor="telefono">Teléfono</label>
              <input type="tel" id="telefono" name="telefono" />
            </div>

            <div className="mensaje">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea id="mensaje" name="mensaje"></textarea>
            </div>

            <button type="submit">Enviar</button>
          </form>

          <div className="contacto-main">
            <div className="info-redes">
              <Link to="#">
                <i className="fa-brands fa-square-facebook"></i>
              </Link>
              <Link to="#">
                <i className="fa-brands fa-square-instagram"></i>
              </Link>
              <Link to="#">
                <i className="fa-brands fa-square-twitter"></i>
              </Link>
            </div>
            <h3>Contáctanos</h3>
            <p>
              <i className="fa-solid fa-phone"></i> 3225316443
            </p>
            <p>
              <i className="fa-brands fa-square-whatsapp"></i> 3225316443
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contacto;
