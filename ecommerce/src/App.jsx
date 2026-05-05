
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Fotter from "./components/Fotter/Fotter";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import LoginUser from "./pages/LoginUser";
import LoginRegister from "./pages/LoginRegister";
import NuevaContraseña from "./pages/NuevaContraseña";
import CartShopping from './components/Carrito/CartShopping';
import { CartProvider } from "./components/context/cartContext";

import AdminLayout from './admin/Layout/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import ProductosAdmin from './admin/pages/ProductosAdmin';
import PedidosAdmin from './admin/Pages/PedidosAdmin';

function App() {
  return (
    <CartProvider>
      <Routes>

        {/* RUTAS ADMIN — sin Navbar ni Footer */}
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/productos" element={<AdminLayout><ProductosAdmin /></AdminLayout>} />
        <Route path="/admin/pedidos" element={<AdminLayout><PedidosAdmin /></AdminLayout>} />

        {/* RUTAS PÚBLICAS — con Navbar y Footer */}
        <Route path="/*" element={
          <>
            <Navbar />
            <CartShopping />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="producto" element={<Products />} />
              <Route path="contacto" element={<Contacto />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="login" element={<LoginUser />} />
              <Route path="registro" element={<LoginRegister />} />
              <Route path="nuevaContraseña" element={<NuevaContraseña />} />
              <Route path="*" element={<Home />} />
            </Routes>
            <Fotter />
          </>
        } />

      </Routes>
    </CartProvider>
  );
}

export default App;