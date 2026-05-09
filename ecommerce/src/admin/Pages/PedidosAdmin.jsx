import { useEffect, useState } from 'react';
import imprimirFactura from '../components/utils/imprimirFactura';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [toast, setToast] = useState(false);

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

  // ── Ver detalles: llama al endpoint por ID ────────────────────────────────
  const verDetalles = async (pedido) => {
    try {
      setLoadingDetalle(true);
      const res = await fetch(`http://localhost:3001/pedidos/${pedido.id}`);
      if (!res.ok) throw new Error('Error al cargar detalle');
      const data = await res.json();
      setPedidoSeleccionado(data);
    } catch (err) {
      console.log(err)
      alert('No se pudo cargar el detalle: ' + err.message);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const cerrarModal = () => setPedidoSeleccionado(null);

  // ── Imprimir factura ──────────────────────────────────────────────────────
  const imprimirFactura = (pedido) => {
   console.log('Imprimiendo factura:', pedido.id);
    // 👉 Reemplaza con window.print() o tu lógica de PDF
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  const getEstadoClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'status-pendiente';
      case 'enviado':   return 'status-enviado';
      case 'entregado': return 'status-entregado';
      case 'cancelado': return 'status-cancelado';
      default:          return '';
    }
  };

  if (cargando) return <p>Cargando pedidos...</p>;
  if (error)    return <p>Error: {error}</p>;

  return (
    <div className="pedidos-admin-container">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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

                  {/* ── 👁️ Ver detalles ── */}
                  <button
                    className="btn-view"
                    title="Ver detalles"
                    onClick={() => verDetalles(pedido)}  style={{cursor: 'pointer'}}
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>

                  {/* ── 🖨️ Imprimir factura ── */}
                  <button
                    className="btn-print"
                    title="Imprimir factura"
                    onClick={() => imprimirFactura(pedido)} style={{cursor: 'pointer'}} 
                  >
                    <i className="fa-solid fa-print"></i>
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pedidoSeleccionado && (
        <div
          onClick={cerrarModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden', animation: 'fadeUp 0.2s ease' }}
          >
            {/* Cabecera */}
            <div style={{ background: '#111', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>
                Pedido #{pedidoSeleccionado.id} — {pedidoSeleccionado.nombre_cliente}
              </span>
              <button onClick={cerrarModal} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
            </div>

            {/* Cuerpo */}
            <div style={{ padding: '20px' }}>
              {[
                ['Cliente',  pedidoSeleccionado.nombre_cliente],
                ['Fecha',    new Date(pedidoSeleccionado.fecha).toLocaleDateString('es-CO')],
                ['Método',   pedidoSeleccionado.metodo],
                ['Estado',   pedidoSeleccionado.estado],
                ['Total',    `$${Number(pedidoSeleccionado.total).toLocaleString('es-CO')}`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '7px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}

              {/* Items del pedido — ajusta "items" al nombre real de tu campo */}
              {pedidoSeleccionado.items?.length > 0 && (
                <>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', marginTop: '14px', marginBottom: '6px', letterSpacing: '0.06em' }}>
                    PRODUCTOS
                  </p>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                    <thead>
                      <tr>
                        {['Producto', 'Cant.', 'Precio'].map((h) => (
                          <th key={h} style={{ background: '#f9fafb', padding: '6px 10px', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pedidoSeleccionado.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ padding: '6px 10px', borderBottom: '1px solid #f9fafb' }}>{item.nombre}</td>
                          <td style={{ padding: '6px 10px', borderBottom: '1px solid #f9fafb' }}>{item.cantidad}</td>
                          <td style={{ padding: '6px 10px', borderBottom: '1px solid #f9fafb' }}>${Number(item.precio).toLocaleString('es-CO')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>

            {/* Pie */}
            <div style={{ padding: '14px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={cerrarModal} style={{ padding: '0 16px', cursor: 'pointer', height: '34px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                Cerrar
              </button>
              <button
                onClick={() => imprimirFactura(pedidoSeleccionado)}
                style={{ padding: '0 16px', height: '34px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: '#111', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="fa-solid fa-print"></i> Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast confirmación ─────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: '24px', left: '50%',
        transform: `translateX(-50%) translateY(${toast ? '0' : '40px'})`,
        opacity: toast ? 1 : 0,
        background: '#111', color: '#fff', fontSize: '13px',
        padding: '10px 18px', borderRadius: '8px',
        display: 'flex', alignItems: 'center', gap: '8px',
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        zIndex: 2000, pointerEvents: 'none'
      }}>
        <i className="fa-solid fa-check"></i> Factura enviada a imprimir
      </div>

    </div>
  );
};

export default PedidosAdmin;