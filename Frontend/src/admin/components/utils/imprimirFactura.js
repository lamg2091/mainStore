const imprimirFactura = (pedido) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Factura #${pedido.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #111; }
        .header { display: flex; justify-content: space-between; margin-bottom: 32px; }
        .empresa { font-size: 22px; font-weight: 700; }
        .empresa span { display: block; font-size: 13px; font-weight: 400; color: #6b7280; margin-top: 4px; }
        .factura-info { text-align: right; font-size: 13px; }
        .factura-info strong { font-size: 18px; display: block; margin-bottom: 4px; }
        hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
        .cliente-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; margin-bottom: 28px; }
        .label { color: #6b7280; }
        .value { font-weight: 500; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px; }
        thead tr { background: #111; color: #fff; }
        th { padding: 10px 14px; text-align: left; font-weight: 600; }
        td { padding: 10px 14px; border-bottom: 1px solid #f3f4f6; }
        .total-box { float: right; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px 20px; min-width: 200px; }
        .total-final { display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; }
        .footer { clear: both; margin-top: 60px; text-align: center; font-size: 12px; color: #9ca3af; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="empresa">
          MainStore
          <span>NIT: 123.456.789-0</span>
          <span>Santa Marta, Colombia</span>
        </div>
        <div class="factura-info">
          <strong>Factura #${pedido.id}</strong>
          <div>Fecha: ${new Date(pedido.fecha).toLocaleDateString('es-CO')}</div>
          <div>Método: ${pedido.metodo}</div>
          <div>Estado: ${pedido.estado}</div>
        </div>
      </div>
      <hr />
      <div class="cliente-grid">
        <span class="label">Cliente</span>
        <span class="value">${pedido.nombre_cliente}</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Producto</th><th>Cantidad</th><th>Precio unit.</th><th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${pedido.items?.map(item => `
            <tr>
              <td>${item.nombre}</td>
              <td>${item.cantidad}</td>
              <td>$${Number(item.precio).toLocaleString('es-CO')}</td>
              <td>$${Number(item.subtotal ?? item.precio * item.cantidad).toLocaleString('es-CO')}</td>
            </tr>
          `).join('') ?? '<tr><td colspan="4">Sin productos</td></tr>'}
        </tbody>
      </table>
      <div class="total-box">
        <div class="total-final">
          <span>Total</span>
          <span>$${Number(pedido.total).toLocaleString('es-CO')}</span>
        </div>
      </div>
      <div class="footer">
        Gracias por tu compra · MainStore © ${new Date().getFullYear()}
      </div>

      <script>
        // Se imprime automáticamente al cargar la página
        window.onload = () => window.print();
      </script>
    </body>
    </html>
  `;

  // ✅ Abre la ventana y escribe el HTML directo (sin setTimeout)
  const ventana = window.open('', '_blank', 'width=800,height=600');
  ventana.document.open();
  ventana.document.write(html);
  ventana.document.close();
};

export default imprimirFactura;