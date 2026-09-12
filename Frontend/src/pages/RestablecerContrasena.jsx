import '../styles/NuevaContraseña.css'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'

const RestablecerContraseña = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await fetch("http://localhost:3001/reset-password", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: data.newPassword })
            });
            const result = await res.json();

            if (res.ok) {
                alert(result.message || "Contraseña actualizada correctamente");
                reset();
                navigate('/login');
            } else {
                alert(result.error || "El enlace es inválido o expiró");
            }
        } catch (err) {
            console.error(err);
            alert("Error al restablecer la contraseña");
        }
    }

    return (
        <div>
            <div className='nuevaContraseña'>
                <form className="forgot-password" onSubmit={handleSubmit(onSubmit)}>
                    <h1>Nueva Contraseña</h1>
                    <div className="input-nuevaPass">
                        <label htmlFor="newPassword">Nueva contraseña</label>
                        <input
                        placeholder='Ingrese su contrasena'
                            type="password"
                            id="newPassword"
                            {...register('newPassword', {
                                required: "por favor ingrese la nueva contraseña",
                                minLength: {
                                    value: 6,
                                    message: "debe tener al menos 6 caracteres"
                                }
                            })}
                        />
                        {errors.newPassword && <span className='error'>{errors.newPassword.message}</span>}
                    </div>
                    <button type="submit">Guardar contraseña</button>
                </form>
            </div>
        </div>
    )
}

export default RestablecerContraseña
