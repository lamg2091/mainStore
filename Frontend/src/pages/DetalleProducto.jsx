import { Link } from "react-router-dom";
import imagenPerfil from "../../public/images/perfil.jpg";
import "../styles/DetalleProducto.css";
import Hamburguer from "../components/Hamburguer";
import { useState } from "react";
import sandalia from "../../public/images/sandalias.jpg";

const DetalleProducto = () => {
  const tallas = ["XS", "S", "M", "L", "XL"];
  const [tallaSeleccionada, setTallaSeleccionada] = useState("M");

  const resenas = [
    {
      nombre: "Luis Mejia",
      tiempo: "Hace 2 semanas",
      talla: "M",
      texto:
        "Cae muy bien y el lino es de buena calidad. La compraría en otro color.",
    },
    {
      nombre: "Maria M...",
      tiempo: "Hace 2 semanas",
      talla: "M",
      texto:
        "El corte es más holgado de lo que esperaba pero me encantó el resultado final.",
    },
    {
      nombre: "Daniela Gomez",
      tiempo: "Hace 2 semanas",
      talla: "S",
      texto:
        "Buena tela, aunque se arruga fácil como todo lino. El envío llegó a tiempo.",
    },
  ];
  return (
    <>
      <div className="container">
        <div className="header-detalle-producto">
          <h2>MainStore</h2>
          <nav className="navegacion">
            <ul className="items">
              <li>
                <Link to="">Mujer</Link>
              </li>
              <li>
                <Link to="">Hombre</Link>
              </li>
              <li>
                <Link to="">Accesorio</Link>
              </li>
            </ul>
          </nav>
          <div className="utilidades">
            <div className="search">
              <label htmlFor="buscar">Buscar</label>
              <input type="search" />
            </div>

            <span>Cuenta</span>
            <p>
              Bolsa <span>(0)</span>
            </p>

            <Hamburguer  />
          </div>
        </div>
      </div>

      <main className="contenedor-principal">
        <div className="img-detalle">
          <img src={sandalia} alt="imagen producto" />
        </div>

        <div className="contenedor-detalle">
          <section className="descripcion-detalle">
            <h1>Sandaliasn de playa</h1>

            <p>Cuero 100% con ajuste perfecto para tus pies</p>

            <p className="precio">
              189.000 <del className="precio-antes">229.000</del>
            </p>

            <h3>Talla - {tallaSeleccionada}</h3>
            <div className="card-talla">
              {tallas.map((talla) => (
                <span
                  key={talla}
                  className={talla === tallaSeleccionada ? "active" : ""}
                  onClick={() => setTallaSeleccionada(talla)}
                >
                  {talla}
                </span>
              ))}
            </div>

            <button
              className="btn-detalle"
              type="submit"
              style={{ marginBlock: "10px" }}
            >
              Agregar a la bolsa
            </button>
            <p className="nota-envio">
              Envío gratis en compras superiores a $150.000 · Devoluciones sin
              costo dentro de 30 días
            </p>
          </section>

          <section className="resena-detalle">
            <h2>Reseña del cliente</h2>
            <div className="puntuacion">
              <span>7.5</span>
              {[...Array(5)].map((_, index) => (
               <i class="fa-solid fa-star" key={index}></i>
              ))}
            </div>
          </section>

          <section className="resena-usuario">
            {resenas.map((testimonio) => (
              <div className="card-detalle" key={testimonio.nombre}>
                <div className="utility">
                  <img src={imagenPerfil} alt={testimonio.nombre} />
                  <h4>{testimonio.nombre}</h4>
                </div>
                <p>
                  {testimonio.tiempo} - {testimonio.talla}
                </p>
                <p>{testimonio.texto}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};

export default DetalleProducto;
