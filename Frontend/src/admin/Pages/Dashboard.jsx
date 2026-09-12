import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const [datos, setDatos]       = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('http://localhost:3001/dashboard');
        if (!res.ok) throw new Error('Error al cargar el dashboard');
        const data = await res.json();
        setDatos(data);
      } catch (err) {
        console.log(err)
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    fetchDashboard();
  }, []);

  const getStatusActividad = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'entregado': return 'completado';
      case 'cancelado': return 'cancelado';
      default:          return 'registro';
    }
  };

  if (cargando) return <p style={{ padding: '2rem' }}>Cargando dashboard...</p>;
  if (error)    return <p style={{ padding: '2rem', color: 'red' }}>Error: {error}</p>;

  return (
    <div className="dashboard-container">

      {/* BIENVENIDA */}
      <div className="dashboard-welcome">
        <div className="welcome-text">
          <h1>¡Hola de nuevo! 👋</h1>
          <p>Esto es lo que está pasando en <strong>MainStore</strong> hoy.</p>
        </div>
        <button className="btn-reporte">
          <i className="fa-solid fa-file-export"></i> Descargar Reporte
        </button>
      </div>

      {/* ESTADÍSTICAS */}
      <div className="stats-grid">
        <StatCard
          titulo="Ingresos Brutos"
          valor={`$${Number(datos.ingresos).toLocaleString('es-CO')}`}
          icono="fa-solid fa-money-bill-trend-up"
          color="#10b981"
        />
        <StatCard
          titulo="Nuevos Pedidos Hoy"
          valor={datos.pedidosHoy}
          icono="fa-solid fa-box-open"
          color="#3b82f6"
        />
        <StatCard
          titulo="Productos en Catálogo"
          valor={datos.productos}
          icono="fa-solid fa-shirt"
          color="#8b5cf6"
        />
        <StatCard
          titulo="Usuarios Registrados"
          valor={datos.usuarios}
          icono="fa-solid fa-users"
          color="#f59e0b"
        />
      </div>

      <div className="dashboard-bottom-section">

        {/* ALERTA DE INVENTARIO */}
        <div className="dashboard-card stock-alert">
          <h3>⚠️ Alerta de Inventario</h3>
          {datos.stockBajo.length === 0 ? (
            <p style={{ padding: '1rem', color: '#6b7280' }}>No hay productos con stock bajo.</p>
          ) : (
            <ul className="stock-list">
              {datos.stockBajo.map((prod) => (
                <li key={prod.id}>
                  <img src={prod.imagen_url} alt={prod.nombre} />
                  <div className="stock-info">
                    <span>{prod.nombre}</span>
                    <small style={{ color: '#ef4444' }}>
                      Quedan solo {prod.stock} unidades
                    </small>
                  </div>
                  <button className="btn-reponer">Reponer</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ACTIVIDAD RECIENTE */}
        <div className="dashboard-card recent-activity">
          <h3>⚡ Actividad Reciente</h3>
          <div className="activity-timeline">
            {datos.actividad.map((act) => (
              <div className="activity-item" key={act.id}>
                <div className={`activity-dot ${getStatusActividad(act.estado)}`}></div>
                <div className="activity-content">
                  <p>
                    <strong>{act.nombre_cliente}</strong>{' '}
                    {act.estado === 'cancelado'
                      ? `canceló el pedido #${act.id}`
                      : `realizó un pedido por $${Number(act.total).toLocaleString('es-CO')}`}
                  </p>
                  <span>{new Date(act.fecha).toLocaleDateString('es-CO')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;