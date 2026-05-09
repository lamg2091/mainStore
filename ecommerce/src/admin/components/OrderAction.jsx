import { useState, useEffect } from "react";

const estadoColor = {
  Pagado:    { bg: "#dcfce7", color: "#166534" },
  Pendiente: { bg: "#fef9c3", color: "#854d0e" },
  Enviado:   { bg: "#dbeafe", color: "#1e40af" },
};

export default function OrderActions() {
  const [pedidos, setPedidos]                 = useState([]);
  const [pedidoSeleccionado, setPedido]       = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [toast, setToast]                     = useState(false);

  // ── 1. Traer pedidos de la BD ──────────────────────────────────────────────
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/api/pedidos"); // 👈 cambia por tu URL
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setPedidos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  // ── 2. Traer detalle de un pedido por ID ───────────────────────────────────
  const verDetalles = async (pedido) => {
    try {
      const res = await fetch(`http://localhost:3000/api/pedidos/${pedido.id}`); // 👈 cambia por tu URL
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setPedido(data);
    } catch (err) {
      alert("No se pudo cargar el detalle: " + err.message);
    }
  };

  const cerrarModal = () => setPedido(null);

  // ── 3. Imprimir ────────────────────────────────────────────────────────────
  const imprimirFactura = (pedido) => {
    console.log("Imprimiendo:", pedido.id);
    // Reemplaza con window.print() o generación de PDF
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  };

  // ── Estados de carga / error ───────────────────────────────────────────────
  if (loading) return (
    <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
      Cargando pedidos...
    </div>
  );

  if (error) return (
    <div style={{ padding: "2rem", textAlign: "center", color: "#dc2626", fontSize: "14px" }}>
      Error al cargar: {error}
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "2rem", maxWidth: "760px", margin: "0 auto" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .btn-view:hover  { background: #dbeafe !important; transform: scale(1.08); }
        .btn-print:hover { background: #e5e7eb !important; transform: scale(1.08); }
      `}</style>

      <p style={{ fontSize: "18px", fontWeight: 600, marginBottom: "1.25rem" }}>Pedidos</p>

      {/* ── Tabla ── */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px", background: "#fff", borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        <thead>
          <tr>
            {["Factura", "Cliente", "Fecha", "Total", "Estado", "Acciones"].map((h) => (
              <th key={h} style={{ background: "#f3f4f6", padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id}>
              {/* 
                Ajusta los campos según tu BD:
                pedido.id        → id o numero_factura
                pedido.cliente   → nombre_cliente o cliente.nombre
                pedido.fecha     → fecha_pedido o created_at
                pedido.total     → total o monto_total
                pedido.estado    → estado o status
              */}
              <td style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}><strong>{pedido.id}</strong></td>
              <td style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>{pedido.cliente}</td>
              <td style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>{pedido.fecha}</td>
              <td style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}><strong>{pedido.total}</strong></td>
              <td style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "20px", fontSize: "11.5px", fontWeight: 600, ...(estadoColor[pedido.estado] || { bg: "#f3f4f6", color: "#374151" }) }}>
                  {pedido.estado}
                </span>
              </td>
              <td style={{ padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    className="btn-view"
                    title="Ver detalles"
                    onClick={() => verDetalles(pedido)}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #bfdbfe", background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontSize: "14px", transition: "background 0.15s, transform 0.1s" }}
                  >
                    <i className="fa-solid fa-eye"></i>
                  </button>
                  <button
                    className="btn-print"
                    title="Imprimir factura"
                    onClick={() => imprimirFactura(pedido)}
                    style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#f9fafb", color: "#374151", cursor: "pointer", fontSize: "14px", transition: "background 0.15s, transform 0.1s" }}
                  >
                    <i className="fa-solid fa-print"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Modal ── */}
      {pedidoSeleccionado && (
        <div onClick={cerrarModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden", animation: "fadeUp 0.2s ease" }}>
            <div style={{ background: "#111", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>Detalles — {pedidoSeleccionado.id}</span>
              <button onClick={cerrarModal} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: "20px" }}>
              {[["Cliente", pedidoSeleccionado.cliente], ["Fecha", pedidoSeleccionado.fecha], ["Total", pedidoSeleccionado.total], ["Estado", pedidoSeleccionado.estado]].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ color: "#6b7280" }}>{label}</span>
                  <span style={{ fontWeight: 500 }}>{value}</span>
                </div>
              ))}

              {/* Items del pedido — ajusta pedidoSeleccionado.items al nombre real de tu campo */}
              {pedidoSeleccionado.items?.length > 0 && (
                <>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", marginTop: "14px", marginBottom: "6px", letterSpacing: "0.06em" }}>PRODUCTOS</p>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
                    <thead>
                      <tr>
                        {["Producto", "Cant.", "Precio"].map((h) => (
                          <th key={h} style={{ background: "#f9fafb", padding: "6px 10px", textAlign: "left", fontWeight: 600, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pedidoSeleccionado.items.map((item, i) => (
                        <tr key={i}>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #f9fafb" }}>{item.nombre}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #f9fafb" }}>{item.cantidad}</td>
                          <td style={{ padding: "6px 10px", borderBottom: "1px solid #f9fafb" }}>{item.precio}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>

            <div style={{ padding: "14px 20px", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button onClick={cerrarModal} style={{ padding: "0 16px", height: "34px", borderRadius: "8px", border: "1px solid #d1d5db", background: "#fff", color: "#374151", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                Cerrar
              </button>
              <button onClick={() => { imprimirFactura(pedidoSeleccionado); cerrarModal(); }} style={{ padding: "0 16px", height: "34px", borderRadius: "8px", border: "none", background: "#111", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <i className="fa-solid fa-print"></i> Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: `translateX(-50%) translateY(${toast ? "0" : "40px"})`, opacity: toast ? 1 : 0, background: "#111", color: "#fff", fontSize: "13px", padding: "10px 18px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", zIndex: 2000, pointerEvents: "none" }}>
        <i className="fa-solid fa-check"></i> Factura enviada a imprimir
      </div>
    </div>
  );
}
