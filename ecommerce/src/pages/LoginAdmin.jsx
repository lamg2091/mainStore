import React from 'react'
import { FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/loginAdmin.css'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'

const loginAdmin = () => {
  const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: "", password: ""}
  })
  const [mostrarcontraseña, setMostrarContraseña] = useState(false)
  useEffect(()=>{
    const guardarDatos = localStorage.getItem('adminSesion')
    if (guardarDatos){
      const datosAnalizados = JSON.parse(guardarDatos)
      if (datosAnalizados.email) setValue("email", datosAnalizados.email);
      if (datosAnalizados.password) setValue("password", datosAnalizados.password);
    }
  }, [setValue]);
  const toggleContraseña = () =>{
    setMostrarContraseña(!mostrarcontraseña)
  }
  const onSubmit = async (data) => {
  try {
    const response = await fetch("http://127.0.0.1:3001/login-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });

    const resultado = await response.json();

    if (response.ok) {
      alert('Inicio de sesión exitoso');
      
      localStorage.setItem("adminSesion", JSON.stringify({
        email: data.email,
        token: resultado.token
      }));
      
      navigate("/admin"); 
      
    } else {
      alert(resultado.message || "Credenciales incorrectas del administrador");
    }

  } catch (error) {
    console.error("Error al conectarte con el servidor", error);
    alert("No se pudo conectar al servidor. Asegúrate de que esté corriendo.");
  }
};
  return (
    <div>
      <div className="contenedor-contenedor-principal">
        <div className="contenedor-formulario">
          <form action="" className='form' onSubmit={handleSubmit(onSubmit)}>
            <FaUser className='user' />
            <div className="titulo">
              <h1>Admin</h1>
            </div>
            <div className="form-admin">
              <label htmlFor="email">Email</label>
              <input type="email"
                name="email"
                id="email"
                autoComplete='on'
                placeholder='Email...'
                {...register('email', {
                  required: "Este Campo deber ser ingresado",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Debes ingresar un correo valido"
                  }
                })}
              />
              {errors.email && <span className='error' >{errors.email.message}</span>}
            </div>
            <div className="form-admin">
              <label htmlFor="password">Password</label>
              <input type={mostrarcontraseña ? 'text': 'password'}
                name="password"
                id="password"
                autoComplete='on'
                placeholder='Password...'
                {...register('password',{
                  required: 'Este campo no debe estar vacio',
                  minLength:{
                    value: 6,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                  }
                })}
              />
              {errors.password && <span className='error' >{errors.password.message}</span>}
            </div>
            <div className="show-password" onClick={toggleContraseña}>
              <input type="checkbox" id='show'/>
              <label htmlFor="show">Mostrar Contraseña</label>
            </div>
            <div className="forgot-password">
              <span>¿Olvidastes tu contraseña?<Link to="/">Click aqui</Link></span>
            </div>
            <button type="submit">Entrer</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default loginAdmin