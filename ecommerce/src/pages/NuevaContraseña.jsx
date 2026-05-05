import '../styles/NuevaContraseña.css'
import {useForm} from 'react-hook-form'
const NuevaContraseña = () => {
    const {register,
    handleSubmit,
    reset,
    formState: { errors },} = useForm();

    const onSubmit = (data) => {
        alert("formulario enviado coectamente",data);
        reset()
    }
  return (
    
    <div>
       <div className='nuevaContraseña'>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <h1>Nueva Contraseña</h1>
                <div className="input-nuevaPass">
                    <label htmlFor="nuevapass">Correo electronico</label>
                    <input type="email" 
                    name="name" 
                    id="name" 
                    {...register('email',{
                        required: "por favor ingrese el correo",
                        pattern:{
                            value: /^(\w+[/./-]?){1,}@\w+([/./-]?\w+)*(\.\w{2,3})+$/,
                            message: "Ingrese un correo valido"
                        }
                    })}
                    />
                    {errors.email && <span className='error'>{errors.email.message}</span>}
                </div>
                <button type="submit">Enviar</button>
            </form>
       </div>
    </div>
  )
}

export default NuevaContraseña