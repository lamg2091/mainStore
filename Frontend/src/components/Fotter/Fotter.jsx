import '../Fotter/Fotter.css'
import {Link} from 'react-router-dom'
import LogoEcommerce from '../../assets/logo-store.jpg'

const Fotter = () => {
  return (
    <div>
       <footer className='container-main-footer'>
            <div className="logoEcomerce">
                <img src={LogoEcommerce} alt="logo emprese" width={75}/>
                 <h2>Main-store</h2>
            </div>
            <div className="container-public">
                 <div className="redes-sociales">
                <h3>Siguenos en nuestras redes</h3>
                <Link to="#"><i className="fa-brands fa-facebook"></i></Link>
                <Link to="#"><i className="fa-brands fa-instagram"></i></Link>
                <Link to="#"><i className="fa-brands fa-x"></i></Link>
                <Link to="#"><i className="fa-brands fa-youtube"></i></Link>
            </div>
            <div className="contacto-footer">
                <h3>Contactanos</h3>
                <Link to="#"><i className="fa-solid fa-phone"></i></Link>
                <Link to="#"><i className="fa-brands fa-square-whatsapp"></i></Link>
                <Link to="#"><i className="fa-solid fa-envelope"></i></Link>
            </div>
            </div>
            <p>&copy; Derechos reservados 2026 Main-store</p>
       </footer>
    </div>
  )
}

export default Fotter