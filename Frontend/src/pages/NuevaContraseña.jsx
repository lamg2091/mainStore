import '../styles/NuevaContraseña.css'
import { useForm } from 'react-hook-form'

const NuevaContraseña = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await fetch("http://localhost:3001/forgot-password", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email })
            });
            const result = await res.json();
            alert(result.message || "Solicitud enviada, revisa tu correo");
            reset();
        } catch (err) {
            console.error(err);
            alert("Error al enviar la solicitud");
        }
    }

    return (
        <div>
            <div className='nuevaContraseña'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>Recuperar Contraseña</h1>
                    <div className="input-nuevaPass">
                        <label htmlFor="email">Correo electronico</label>
                        <input
                        placeholder='Ingrese su contrasena'
                            type="email"
                            id="email"
                            {...register('email', {
                                required: "por favor ingrese el correo",
                                pattern: {
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
