import { Link, useLocation } from "react-router-dom";
import "./styleAdmin/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  // Función para saber si el enlace está activo y cambiar el estilo
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <aside className="sidebar-admin">
      <div className="sidebar-logo">
        <i className="fa-solid fa-store"></i>
        <span>
          MainStore <strong>Admin</strong>
        </span>
      </div>

      <nav className="sidebar-menu">
        <p className="menu-label">Principal</p>
        <Link to="/admin" className={`menu-item ${isActive("/admin")}`}>
          <i className="fa-solid fa-chart-pie"></i>
          <span>Dashboard</span>
        </Link>

        <p className="menu-label">Inventario</p>
        <Link
          to="/admin/productos"
          className={`menu-item ${isActive("/admin/productos")}`}
        >
          <i className="fa-solid fa-tags"></i>
          <span>Productos</span>
        </Link>
        <Link
          to="/admin/categorias"
          className={`menu-item ${isActive("/admin/categorias")}`}
        >
          <i className="fa-solid fa-layer-group"></i>
          <span>Categorías</span>
        </Link>

        <p className="menu-label">Ventas</p>
        <Link
          to="/admin/pedidos"
          className={`menu-item ${isActive("/admin/pedidos")}`}
        >
          <i className="fa-solid fa-receipt"></i>
          <span>Pedidos</span>
          <span className="badge-new">5</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="menu-item back-store">
          <i className="fa-solid fa-arrow-left"></i>
          <span>Volver a la tienda</span>
        </Link>
        <button className="btn-logout-sidebar">
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
