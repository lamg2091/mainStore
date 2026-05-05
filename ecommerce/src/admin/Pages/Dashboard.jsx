import React from "react";
import StatCard from "../components/StatCard";
import DataProducto from "../../Data/DataProducto";
import '../../styles/Dashboard.css'

const Dashboard = () => {
  const actividadesRecientes = [
    {
      id: 1,
      usuario: "Ana Silva",
      accion: "compró 2 Camisetas",
      tiempo: "Hace 5 min",
      status: "completado",
    },
    {
      id: 2,
      usuario: "Pedro Páramo",
      accion: "registró una nueva cuenta",
      tiempo: "Hace 15 min",
      status: "registro",
    },
    {
      id: 3,
      usuario: "Marta Gómez",
      accion: "canceló el pedido #4522",
      tiempo: "Hace 1 hora",
      status: "cancelado",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* SECCIÓN DE BIENVENIDA */}
      <div className="dashboard-welcome">
        <div className="welcome-text">
          <h1>¡Hola de nuevo, Luis! 👋</h1>
          <p>
            Esto es lo que está pasando en <strong>MainStore</strong> hoy.
          </p>
        </div>
        <button className="btn-reporte">
          <i className="fa-solid fa-file-export"></i> Descargar Reporte
        </button>
      </div>

      {/* REJILLA DE ESTADÍSTICAS (Usa las StatCards) */}
      <div className="stats-grid">
        <StatCard
          titulo="Ingresos Brutos"
          valor="$8.540.000"
          icono="fa-solid fa-money-bill-trend-up"
          tendencia={24}
          color="#10b981"
        />
        <StatCard
          titulo="Nuevos Pedidos"
          valor="42"
          icono="fa-solid fa-box-open"
          tendencia={12}
          color="#3b82f6"
        />
        <StatCard
          titulo="Productos en Catálogo"
          valor={DataProducto.length}
          icono="fa-solid fa-shirt"
          color="#8b5cf6"
        />
        <StatCard
          titulo="Visitas hoy"
          valor="1,204"
          icono="fa-solid fa-eye"
          tendencia={-2}
          color="#f59e0b"
        />
      </div>

      <div className="dashboard-bottom-section">
        <div className="dashboard-card stock-alert">
          <h3>⚠️ Alerta de Inventario</h3>
          <ul className="stock-list">
            {DataProducto.slice(0, 4).map((prod) => (
              <li key={prod.id}>
                <img src={prod.imagen} alt={prod.nombre} />
                <div className="stock-info">
                  <span>{prod.nombre}</span>
                  <small>Quedan solo 3 unidades</small>
                </div>
                <button className="btn-reponer">Reponer</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="dashboard-card recent-activity">
          <h3>⚡ Actividad Reciente</h3>
          <div className="activity-timeline">
            {actividadesRecientes.map((act) => (
              <div className="activity-item" key={act.id}>
                <div className={`activity-dot ${act.status}`}></div>
                <div className="activity-content">
                  <p>
                    <strong>{act.usuario}</strong> {act.accion}
                  </p>
                  <span>{act.tiempo}</span>
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
