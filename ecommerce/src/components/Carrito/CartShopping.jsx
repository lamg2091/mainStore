import { useCart } from '../context/cartContext';
import '../Carrito/CartShopping.css';

const CartShopping = () => {
  const tallasDisponibles = ["S", "M", "L", "XL"];
  const { isOpen, toggleCart, cart, total, closeCart, removeFromCart, updateQuantity, updateSize, clearCart } = useCart();

  const confirmarPago = async () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!usuario) {
      alert('Debes iniciar sesión para realizar un pedido');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: usuario.id,
          nombre_cliente: usuario.name,
          total: total,
          metodo: 'efectivo',
          items: cart.map(item => ({
            id: item.id,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precio,
          }))
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('¡Pedido realizado con éxito! 🎉');
        clearCart();  // vacía el carrito
        closeCart();  // cierra el sidebar
      } else {
        alert('Error al crear pedido: ' + data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className={`carrito-overlay ${isOpen ? "open" : ""}`} onClick={toggleCart}>
      <div className={`carrito-sidebar ${isOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>

        <div className="carrito-header">
          <h2>Tu Pedido</h2>
          <button className="close-btn" onClick={closeCart} title='Cerrar Carrito'>X</button>
        </div>

        <div className="carrito-body">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Tu carrito está vacío 🍕</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="carrito-item">
                <img src={item.img} alt={item.nombre} />
                <div className="item-info">
                  <h4>{item.nombre}</h4>
                  <p>${item.precio.toLocaleString()} COP</p>
                  <div className="size-selector">
                    <span>Talla:</span>
                    <select value={item.talla} onChange={(e) => updateSize(item.id, e.target.value)}>
                      {tallasDisponibles.map(talla => (
                        <option key={talla} value={talla}>{talla}</option>
                      ))}
                    </select>
                    <p>{item.color}</p>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="carrito-footer">
            <div className="total-row">
              <span>Total:</span>
              <span className="total-price">${total.toLocaleString()} COP</span>
            </div>
            <button className="checkout-btn" onClick={confirmarPago}>Confirmar Pedido</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartShopping;