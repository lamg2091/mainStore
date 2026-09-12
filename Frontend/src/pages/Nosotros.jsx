import { Link } from "react-router-dom";
import "../styles/Nosotros.css";

const Nosotros = () => {
  return (
    <div>
      <main className="nosotros-container">
        <section className="nosotros-hero">
          <div className="hero-content">
            <h1>Nuestra Historia</h1>
            <p className="subtitle">
              Conoce el equipo y la pasión detrás de <span>Mein-store</span>
            </p>
          </div>
        </section>

        <hr className="section-divider" />

        <section className="nosotros-historia">
          <div className="grid-layout">
            <div className="texto-historia">
              <h2>¿Quiénes somos?</h2>
              <p>
                En <strong>Mein-store</strong>, nacimos con una idea simple pero
                poderosa: ofrecer productos de alta calidad que marquen la
                diferencia en tu día a día. Lo que comenzó como un pequeño
                proyecto apasionado se ha transformado en una comunidad de
                clientes que confían en nuestra selección y servicio.
              </p>
              <p>
                Nos dedicamos a buscar las mejores tendencias y soluciones para
                ti, asegurándonos de que cada compra supere tus expectativas.
              </p>
            </div>
            <div className="imagen-historia">
              <img
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80"
                alt="Equipo de Mein-store trabajando"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="nosotros-valores">
          <h2>Nuestros Pilares</h2>
          <div className="valores-grid">
            <div className="valor-card">
              <i className="fa-solid fa-heart"></i>
              <h3>Pasión por el Cliente</h3>
              <p>
                Tu satisfacción es nuestra prioridad número uno. Siempre estamos
                listos para ayudarte.
              </p>
            </div>

            <div className="valor-card">
              <i className="fa-solid fa-star"></i>
              <h3>Calidad Garantizada</h3>
              <p>
                No vendemos nada que nosotros mismos no usaríamos con orgullo.
              </p>
            </div>

            <div className="valor-card">
              <i className="fa-solid fa-truck-fast"></i>
              <h3>Compromiso y Rapidez</h3>
              <p>
                Nos esforzamos para que tus productos lleguen a tus manos en
                tiempo récord.
              </p>
            </div>
          </div>
        </section>

        <section className="nosotros-cta">
          <div className="cta-box">
            <h2>¿Listo para ver lo que tenemos para ti?</h2>
            <p>
              Explora nuestro catálogo y descubre por qué tantas personas
              confían en nosotros.
            </p>
            <Link to="/productos" className="btn-cta">
              Ir a la Tienda
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Nosotros;
