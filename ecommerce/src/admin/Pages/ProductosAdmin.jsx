import { useEffect, useState } from 'react';
import { useFiltros } from "../../Hook/useFiltros";
import '../components/styleAdmin/productoAdmin.css';

const ProductosAdmin = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const { filtros, actualizarFiltro, productosFiltrados = [] } = useFiltros(listaProductos);
  
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: 'Camiseta',
    precio: '',
    descripcion: '',
    imagen_url: ''
  });

  // 👇 Estados nuevos para editar
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await fetch('http://localhost:3001/productos');
        const data = await response.json();
        if (Array.isArray(data)) {
          setListaProductos(data);
        } else if (data && data.productos) {
          setListaProductos(data.productos);
        }
      } catch (err) {
        console.error('Error al conectar con el servidor:', err);
      }
    };
    cargarProductos();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nuevoProducto,
          precio: Number(nuevoProducto.precio)
        })
      });
      if (response.ok) {
        const guardado = await response.json();
        setListaProductos(prev => [guardado, ...prev]);
        setMostrarModal(false);
        setNuevoProducto({ nombre: '', categoria: 'Camiseta', precio: '', imagen_url: '', descripcion: '' });
      } else {
        const errorData = await response.json();
        alert(`Error al guardar: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  // 👇 Abre el modal y precarga los datos del producto
  const handleEditClick = (producto) => {
    setProductoEditando({ ...producto });
    setMostrarModalEditar(true);
  };

  // 👇 Envía el PUT al servidor
  const handleEditar = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/productos/${productoEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre:    productoEditando.nombre,
          precio:    Number(productoEditando.precio),
          categoria: productoEditando.categoria,
        })
      });

      if (response.ok) {
        // Actualiza la lista local sin recargar
        setListaProductos(prev =>
          prev.map(p => p.id === productoEditando.id ? { ...p, ...productoEditando } : p)
        );
        setMostrarModalEditar(false);
        setProductoEditando(null);
      } else {
        const errorData = await response.json();
        alert(`Error al editar: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error al editar:", error);
    }
  };

  const onDelete = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      try {
        const res = await fetch(`http://localhost:3001/productos/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setListaProductos(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  return (
    <div className="admin-inventory-page">
      <div className="admin-page-header">
        <h1>Gestión de Inventario</h1>
        <button className="btn-add-product" onClick={() => setMostrarModal(true)}>+ Nuevo Producto</button>
      </div>

      {/* --- MODAL CREAR --- */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nuevo Producto</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" required value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input type="text" value={nuevoProducto.descripcion}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, descripcion: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select value={nuevoProducto.categoria}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}>
                  <option value="Camiseta">Camiseta</option>
                  <option value="Accesorio">Accesorio</option>
                  <option value="Calzado">Calzado</option>
                </select>
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" required value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})} />
              </div>
              <div className="form-group">
                <label>URL de Imagen</label>
                <input type="text" value={nuevoProducto.imagen_url}
                  onChange={(e) => setNuevoProducto({...nuevoProducto, imagen_url: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setMostrarModal(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL EDITAR --- */}
      {mostrarModalEditar && productoEditando && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Producto</h2>
            <form onSubmit={handleEditar}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" required value={productoEditando.nombre}
                  onChange={(e) => setProductoEditando({...productoEditando, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select value={productoEditando.categoria}
                  onChange={(e) => setProductoEditando({...productoEditando, categoria: e.target.value})}>
                  <option value="Camiseta">Camiseta</option>
                  <option value="Accesorio">Accesorio</option>
                  <option value="Calzado">Calzado</option>
                  <option value="Pantalon">Pantalon</option>
                </select>
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" required value={productoEditando.precio}
                  onChange={(e) => setProductoEditando({...productoEditando, precio: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setMostrarModalEditar(false)}>Cancelar</button>
                <button type="submit" className="btn-save">Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- FILTROS --- */}
      <div className="admin-filters-bar">
        <input type="text" placeholder="Buscar..."
          value={filtros.busqueda}
          onChange={(e) => actualizarFiltro("busqueda", e.target.value)} />
      </div>

      {/* --- TABLA --- */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {listaProductos.length > 0 ? (
            listaProductos.map(producto => (
              <tr key={producto.id}>
                <td>
                  <img
                    src={producto.imagen_url || producto.imagen || 'https://via.placeholder.com/40?text=Sin+Imagen'}
                    width="40" alt={producto.nombre}
                    style={{ borderRadius: '4px', objectFit: 'cover' }}
                  />
                </td>
                <td>{producto.nombre}</td>
                <td>${Number(producto.precio).toLocaleString()}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.categoria}</td>
                <td>
                  <div className="action-button">
                    <button className="btn-delete" onClick={() => onDelete(producto.id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    {/* 👇 onClick conectado */}
                    <button className="btn-edit" onClick={() => handleEditClick(producto)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosAdmin;