import { useNavigate } from 'react-router-dom';
import "../styles/userLogin.css";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import inicioSesion from "../assets/login.svg";
import { useForm } from "../Hook/useForm";
import { useState } from "react";

const loginUsers = () => {
  const [mostrarPass, setMostrarPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validarDatos = (datos) => {
    let errores = {};
    const regexEmail = /^(\w+[/./-]?){1,}@\w+([/./-]?\w+)*(\.\w{2,3})+$/;

    if (!datos.email.trim()) {
      errores.email = "Este campo es obligatorio";
    } else if (!regexEmail.test(datos.email)) {
      errores.email = "Ingrese un correo valido";
    }
    if (!datos.password) {
      errores.password = "Este campo es obligatorio";
    } else if (datos.password.length < 6) {
      errores.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (!datos.terminos) {
      errores.terminos = "Acepta los terminos y condiciones";
    }
    return errores;
  };

  const { values, errors, handleChange, handleSubmit, reset } = useForm(
    {
      email: "",
      password: "",
      terminos: false,
    },
    validarDatos,
  );

  const submitLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Bienvenido de nuevo: ' + result.user.name);
        localStorage.setItem('usuario', JSON.stringify(result.user)); // ← línea agregada
        reset();
        navigate('/products');
      } else {
        alert('Error: ' + (result.message || result.error));
      }
    } catch (err) {
      console.error('Error de conexión: ', err);
      alert("No se pudo conectar con el servidor backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-form">
        <form
          action=""
          className="form-login"
          onSubmit={(e) => handleSubmit(e, submitLogin)}
        >
          <div className="header-login">
            <img src={inicioSesion} alt=" login" />
            <h1>Inicia sesión</h1>
          </div>

          <div className="group-login">
            <label htmlFor="email">Email</label>
            <FaEnvelope className="icons" />
            <input
              type="email"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="group-login">
            <label htmlFor="password">Password</label>
            <FaLock className="icons" />
            <input
              type={mostrarPass ? 'text' : 'password'}
              name="password"
              id="password"
              value={values.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="show-password" onClick={() => setMostrarPass(!mostrarPass)}>
            {mostrarPass ? <FaEye /> : <FaEyeSlash />}
            <span>Ver contraseña</span>
          </div>

          <div className="entrada">
            <div className="link">
              <input
                type="checkbox"
                name="terminos"
                id="terminos"
                checked={values.terminos}
                onChange={handleChange}
              />
              <label htmlFor="terminos">Acepta términos y condiciones</label>
              {errors.terminos && <p className="error">{errors.terminos}</p>}
            </div>

            <div className="link-login">
              <label>¿no tienes una cuenta?</label>
              <Link to="/registro">Créala aquí</Link>
            </div>
          </div>

          <div className="new-pass">
            <label>¿Has olvidado la contraseña?</label>
            <Link to="/nuevaContraseña">Entra aquí</Link>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>

          <footer className="fotter-login">
            <p>&copy; Main-store</p>
          </footer>
        </form>
      </div>
    </>
  );
};

export default loginUsers;