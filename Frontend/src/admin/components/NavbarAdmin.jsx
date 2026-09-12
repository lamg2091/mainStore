import '../components/styleAdmin/NavbarAdmin.css'

const NavbarAdmin = () => {
 
  const fecha = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="navbar-admin">
      <div className="navbar-left">
        <span className="navbar-date">{fecha}</span>
      </div>

      <div className="navbar-right">
        {/* Buscador rápido global */}
        <div className="navbar-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Buscar pedidos, clientes..." />
        </div>

        {/* Iconos de acción */}
        <div className="navbar-actions">
          <button className="nav-icon-btn" title="Notificaciones">
            <i className="fa-solid fa-bell"></i>
            <span className="nav-dot"></span>
          </button>
          
          <div className="nav-divider"></div>

          {/* Perfil del Usuario */}
          <div className="nav-profile">
            <div className="profile-info">
              <span className="profile-name">Luis Mejia</span>
              <span className="profile-role">Administrador</span>
            </div>
            <img 
              src="https://ui-avatars.com/api/?name=Luis+Mejia&background=3b82f6&color=fff" 
              alt="Avatar Admin" 
              className="profile-avatar"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarAdmin;