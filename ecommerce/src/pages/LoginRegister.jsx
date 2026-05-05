import { FaEnvelope, FaLock, FaUserCircle, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import iconsRegister from "../assets/register.svg";
import { Link, useNavigate } from "react-router-dom";
import "../styles/FormRegister.css";
import { useForm } from "react-hook-form";
import { useState } from "react";


const LoginRegister = () => {
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // --- FUNCIÓN DE ENVÍO AL BACKEND ---
  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/registro', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          name: formData.name,
          email: formData.email,
          password: formData.password 
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Registro exitoso:", result);
        alert("¡Usuario registrado con éxito!");
        reset();
        navigate("/login"); 
      } else {
        alert("Error en el registro: " + (result.error || result.message));
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("No se pudo conectar con el servidor backend. ¿Está encendido?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="contenedor-principal">
        <form className="form-register" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="header-form">
            <img src={iconsRegister} alt="Registro" />
            <h3>Registrate</h3>
          </div>
          
          {/* Campo: Nombre */}
          <div className="input-register">
            <label htmlFor="name">Nombre completo</label>
            <FaUserCircle className="icon" />
            <input
              type="text"
              id="name"
              autoComplete="off"
              {...register("name", {
                required: "El nombre es obligatorio",
              })}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>

          {/* Campo: Email */}
          <div className="input-register">
            <label htmlFor="email">Correo electrónico</label>
            <FaEnvelope className="icon" />
            <input
              type="email"
              id="email"
              autoComplete="off"
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^(\w+[/./-]?){1,}@\w+([/./-]?\w+)*(\.\w{2,3})+$/,
                  message: "Ingresa un email válido",
                },
              })}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>

          {/* Campo: Contraseña */}
          <div className="input-register">
            <label htmlFor="password">Contraseña</label>
            <FaLock className="icon" />
            <input
              type={mostrarContraseña ? 'text' : 'password'}
              id="password"
              autoComplete="off"
              {...register("password", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 6,
                  message: "Debe tener al menos 6 caracteres",
                },
              })}
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>

          {/* Campo: Confirmar Contraseña */}
          <div className="input-register">
            <label htmlFor="confirmar">Confirma la contraseña</label>
            <FaKey className="icon" />
            <input
              type={mostrarContraseña ? 'text' : 'password'}
              id="confirmar"
              autoComplete="off"
              {...register("confirm", {
                required: "Por favor confirma la contraseña",
                validate: (valor) => valor === watch("password") || "Las contraseñas no coinciden",
              })}
            />
            {errors.confirm && <span className="error">{errors.confirm.message}</span>}
          </div>

          {/* Botón Mostrar Contraseña */}
          <div className="mostrar-contraseña" onClick={() => setMostrarContraseña(!mostrarContraseña)}>
            {mostrarContraseña ? <FaEye /> : <FaEyeSlash/>}
            <span>Mostrar contraseña</span>
          </div>

          <div className="link-form">
            <Link to="/login">Login</Link>
            <Link to="/nuevaContraseña">Nueva contraseña</Link>
          </div>

          {/* Botón de Submit */}
          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrate"}
          </button>

          <footer className="fotter-form-register">
            <p>&copy; Main-store</p>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;