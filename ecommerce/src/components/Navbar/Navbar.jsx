import "../Navbar/Navbar.css";
import { Link } from "react-router-dom";
import LogoStore from "../../assets/Logo-store.jpg";
import { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
const Navbar = () => {
  const { toggleCart, cart } = useCart();
  const [menuActive, setMenuActive] = useState(false);
  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  const [modoDark, setModoDark] = useState(() => {
    const modoGuardado = localStorage.getItem("storeInline");
    return modoGuardado === "dark";
  });
  useEffect(() => {
    if (modoDark) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("storeInline", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("storeInline", "light");
    }
  }, [!modoDark]);

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src={LogoStore} alt="logo empresa" />
          <h1>OnlineStore</h1>
        </div>
        <nav className="navbar">
          <ul className={`list-navbar ${menuActive ? "active" : ""}`}>
            <li className="link-navbar">
              <Link to="/inicio">Inicio</Link>
            </li>
            <li className="link-navbar">
              <Link to="/producto">Productos</Link>
            </li>
            <li className="link-navbar">
              <Link to="/contacto">Contanto</Link>
            </li>
            <li className="link-navbar">
              <Link to="/nosotros">Sobre mi</Link>
            </li>

            <div className="button-credenciales">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/registro" className="btn-sing-up">
                Sing up
              </Link>
            </div>
          </ul>
        </nav>

        <button className="dark-mode" onClick={() => setModoDark(!modoDark)}>
          <i className={modoDark ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
        </button>

        <diliv className="shopping-cart"  onClick={(e) => {
          e.preventDefault();
          toggleCart();
        }}>
          <i className="fa-solid fa-cart-shopping" title="Abrir Carrito"></i>
          <span>{cart.length}</span>
        </diliv>

        <button className="menu-hamburguer" onClick={toggleMenu}>
          <i
            className={menuActive ? "fa-solid fa-xmark" : "fa-solid fa-bars"}
          ></i>
        </button>
      </header>
    </>
  );
};

export default Navbar;
