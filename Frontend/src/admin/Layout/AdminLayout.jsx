
import React from 'react';
import { Link } from 'react-router-dom';
import '../Layout/adminLayout.css'
import NavbarAdmin from '../components/NavbarAdmin';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-container">
      {/* Sidebar Lateral */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin"><i className="fa-solid fa-chart-line"></i> Dashboard</Link>
          <Link to="/admin/productos"><i className="fa-solid fa-boxes-stacked"></i> Inventario</Link>
          <Link to="/admin/pedidos"><i className="fa-solid fa-truck-fast"></i> Pedidos</Link>
          <Link to="/"><i className="fa-solid fa-house"></i> Ver Tienda</Link>
        </nav>
        <div className="sidebar-footer">
          <button className="btn-logout">Cerrar Sesión</button>
        </div>
      </aside>

      <div className="admin-main">
        <NavbarAdmin/>
        <header className="admin-top-nav">
          <span>Bienvenido, <strong>Luis Mejia</strong></span>
          <img src="https://ui-avatars.com/api/?name=Luis+Mejia&background=random" alt="User" />
        </header>
        <section className="admin-content">
          {children}
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;