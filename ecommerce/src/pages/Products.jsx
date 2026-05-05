import { useState, useEffect } from "react"; 
import "../styles/Products.css";
import LogoHeader from "../assets/Logo-store.jpg";
import { Link } from "react-router-dom";
import { useCart } from "../components/context/cartContext";
import { useFiltros } from "../Hook/useFiltros";

const Products = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/productos')
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error cargando productos:', err);
        setLoading(false);
      });
  }, []);

  const { filtros, actualizarFiltro, productosFiltrados, limpiarFiltros } =
    useFiltros(productos);
  const { addToCart } = useCart();

  return (
    <div className="products-page-container">
      <div className="products-layout">
        <aside className="aside-main">
          <h3>Filtrar por:</h3>

          <div className="filter-producto">
            <label htmlFor="precio">
              Precio máximo: ${filtros.precioMaximo.toLocaleString()}
            </label>
            <input
              type="range"
              id="precio"
              min="0"
              max="1000000"
              step={10000}
              value={filtros.precioMaximo}
              onChange={(e) =>
                actualizarFiltro("precioMaximo", Number(e.target.value))
              }
            />
          </div>

          <div className="filter-producto">
            <label htmlFor="categoria">Categoría</label>
            <select
              id="categoria"
              value={filtros.categoria}
              onChange={(e) => actualizarFiltro("categoria", e.target.value)}
            >
              <option value="Todos">Todos</option>
              <option value="Pantalones">Pantalones</option>
              <option value="Chaquetas">Chaquetas</option>
              <option value="Blusas">Blusas</option>
              <option value="Vestidos">Vestidos</option>
              <option value="Camisetas">Camisetas</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Buzos">Buzos</option>
            </select>
          </div>

          <div className="filter-producto">
            <label htmlFor="buscador">Nombre</label>
            <input
              type="text"
              id="buscador"
              placeholder="Camisetas, jeans..."
              value={filtros.busqueda}
              onChange={(e) => actualizarFiltro("busqueda", e.target.value)}
            />
          </div>

          <button className="btn-reset" onClick={limpiarFiltros}>
            Limpiar Filtros
          </button>
        </aside>

        <main className="container-main-products">
          <header className="header-producto">
            <img src={LogoHeader} alt="logo main-store" width={75} />
            <h1>Nuestra Colección</h1>
          </header>

          <div className="container-producto">
            {loading ? (
              <p>Cargando productos...</p>  // ← Mientras carga
            ) : productosFiltrados.length > 0 ? (
              productosFiltrados.map((producto) => (
                <div className="card" key={producto.id}>
                  <img src={producto.imagen_url} alt={producto.nombre} />  {/* ← imagen_url */}
                  <h3>{producto.nombre}</h3>
                  <p>{producto.categoria}</p>
                  <strong>$ {producto.precio.toLocaleString()}</strong>
                  <p>Tallas: {producto.tallas?.join(" - ")}</p>
                  <h4>{producto.descripcion}</h4>

                  <div className="botones">
                    <button type="button" onClick={() => addToCart(producto)}>
                      <i className="fa-solid fa-cart-shopping"></i> Add Cart
                    </button>
                    <Link to={`/detalles/${producto.id}`}>
                      <i className="fa-solid fa-circle-info"></i> Detalles
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No se encontraron productos.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products;