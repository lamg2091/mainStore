import '../styles/Home.css'
import {Link}  from 'react-router-dom'
import imagenEcommerce from '../assets/foto-ecomerce.png'
const Home = () => {
  return (
    <div>
        <main className="container-main-home">
            <div className="info-main">
                <h1>Bienvenidos a main-store</h1>
            <p>Deje que sus estilo hable por usted</p>
                <Link to="/producto"><i className="fa-solid fa-house-chimney" style={{marginRight: '8px'}}></i>Haz tu pedido aqui</Link>
            </div>
            <div className="img-main">
                <img src={imagenEcommerce} alt='foto Modelo'/>
            </div>
        </main>
    </div>
  )
}

export default Home