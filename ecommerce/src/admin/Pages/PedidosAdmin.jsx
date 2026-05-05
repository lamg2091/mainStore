import { useEffect, useState } from 'react';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const res = await fetch('http://localhost:3001/pedidos');
        if (!res.ok) throw new Error('Error al cargar pedidos');
        const data = await res.json();
        setPedidos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPedidos();
  }, []);

  const getEstadoClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':  return 'status-pendiente';
      case 'enviado':    return 'status-enviado';
      case 'entregado':  return 'status-entregado';
      case 'cancelado':  return 'status-cancelado';
      default:           return '';
    }
  };

  if (cargando) return <p>Cargando pedidos...</p>;
  if (error)    return <p>Error: {error}</p>;

  return (
    <div className="pedidos-admin-container">
      <div className="admin-page-header">
        <h1>Gestión de Pedidos</h1>
        <div className="pedidos-stats">
          <span>Total pedidos: <strong>{pedidos.length}</strong></span>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td><strong>#{pedido.id}</strong></td>
                <td>{pedido.nombre_cliente}</td>
                <td>{new Date(pedido.fecha).toLocaleDateString('es-CO')}</td>
                <td>${Number(pedido.total).toLocaleString('es-CO')}</td>
                <td>{pedido.metodo}</td>
                <td>
                  <span className={`status-badge ${getEstadoClass(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-view" title="Ver detalles">
                    <i className="fa-solid fa-eye"></i>
                  </button>
                  <button className="btn-print" title="Imprimir factura">
                    <i className="fa-solid fa-print"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PedidosAdmin;