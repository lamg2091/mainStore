import '../styles/Home.css'
import {Link}  from 'react-router-dom'
import imagesModelo from '../assets/foto-modelo.png'
import imagesFondo from '../assets/fondo-home.jpg'
const Home = () => {
  return (
    <div>
        <main className="container-main-home">
            <div className="info-main">
                <h1>Descubre las mejores colleciones</h1>
            <p>Explor nuevos estilos para el confort y el flow cotidiano</p>
                <Link to="/producto"><i className="fa-solid fa-house-chimney" style={{marginRight: '8px'}}></i>Haz tu pedido aqui</Link>
            </div>
            <div className="images-fondo">
                <img class="images1" src={imagesFondo} alt="" />
                <img src={imagesModelo} alt="" />
            </div>
        </main>
    </div>
  )
}

export default Home