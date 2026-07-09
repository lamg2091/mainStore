import "../Navbar/Navbar.css";
import { Link } from "react-router-dom";
import LogoStore from "../../assets/Logo-store.jpg";
import { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import { FaUser, FaChevronDown, FaLock } from "react-icons/fa";
const Navbar = () => {
  const [dropdownAbierto, setDropdownAbierto] = useState(false)
  const toggleDropdown = (e) => {
    e.preventDefault();
    setDropdownAbierto(!dropdownAbierto)
  }
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

            <div className="usuario-dropdown-container">
              <button className="dropdown-boton" onClick={toggleDropdown}>
                  <FaUser/> Mi cuenta <span className="flecha-dropdown"><FaChevronDown/></span>
              </button>

              {dropdownAbierto && (
                <ul className="dropdown-lista">
                  <li>
                    <Link to="/login" onClick={() => setDropdownAbierto(false)}> <FaLock/> Ingreso clinte</Link>
                  </li>
                   <li>
                    <Link to="/registro"  onClick={() => setDropdownAbierto(false)}> <FaUser/> Registrate</Link>
                  </li>
                  <li className="dropdown-divisor"></li>
                  <li>
                <Link 
                  to="/loginadmin" 
                  className="opcion-admin"  onClick={() => setDropdownAbierto(false)}
                >
                  ⚙️ Sistema / Gestión
                </Link>
              </li>
                </ul>
              )}
            </div>
          </ul>
        </nav>

        <button className="dark-mode" onClick={() => setModoDark(!modoDark)}>
          <i className={modoDark ? "fa-solid fa-moon" : "fa-solid fa-sun"}></i>
        </button>

        <div className="shopping-cart"  onClick={(e) => {
          e.preventDefault();
          toggleCart();
        }}>
          <i className="fa-solid fa-cart-shopping" title="Abrir Carrito"></i>
          <span>{cart.length}</span>
        </div>

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
