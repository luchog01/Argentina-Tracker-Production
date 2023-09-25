import './Home.css'
import menuImg from './images/menu.PNG'
import graficoImg from './images/grafico.PNG'
import totalYPromedioImg from './images/total y promedio.PNG'
import pointImg from './images/point.PNG'
import compararImg from './images/comparar.PNG'
import categoriasImg from './images/categorias.PNG'
import descargarImg from './images/descargar.PNG'

import React from 'react'

const Home = () => {
        const openGraph = () => {
                window.open(`/graph`, '_self', 'noopener,noreferrer')
        }

        return (
                <div className='homepage-container'>
                        <div className='welcome-container'>
                                <div className='welcome'>
                                        <h1 className='welcome-text'>FCI Tracker es una pagina donde va a poder visualizar el portafolio de los Fondos Comunes de Inversion de Argentina a lo largo del tiempo.</h1>
                                        <h1 className='welcome-text'>Si usted piensa comprar o vender algun activo, de seguro le servira saber que estan haciendo los grandes fondos!</h1>
                                </div>
                                <button onClick={() => openGraph()}>Empezar</button>
                        </div>
                        <div className='tutorial-block'>
                                <div className='tutorial-text-img'>
                                        <h2>Con este menu podrás buscar el ticker que desees</h2>
                                        <img src={menuImg} alt="" />
                                </div>
                        </div>
                        <div className='tutorial-block tutorial-block-even'>
                                <div className='tutorial-text-img'>
                                        <img className='grafico-img' src={graficoImg} alt="" />
                                        <h2>Este es el gráfico del ticker elegido</h2>
                                </div>
                        </div>
                        <div className='tutorial-block'>
                                <div className='tutorial-text-img'>
                                        <h2>Tocando el total o el promedio podrás elegir cual quieres que se muestre</h2>
                                        <img src={totalYPromedioImg} alt="" />
                                </div>
                        </div>
                        <div className='tutorial-block tutorial-block-even'>
                                <div className='tutorial-text-img'>
                                        <img src={pointImg} alt="" />
                                        <h2>Tocar cualquier punto te mandará a una página con los detalles del ticker en esa fecha</h2>
                                </div>
                        </div>
                        <div className='tutorial-block'>
                                <div className='tutorial-text-img'>
                                        <h2>Con este menu podrás comparar los datos del ticker en dos fechas distintas</h2>
                                        <img src={compararImg} alt="" />
                                </div>
                        </div>
                        <div className='tutorial-block tutorial-block-even'>
                                <div className='tutorial-text-img'>
                                        <img src={categoriasImg} alt="" />
                                        <h2>Tocando cualquier categoría podrás ordenar los fondos de manera ascendente o descendente según esa categoría</h2>
                                </div>
                        </div>
                        <div className='tutorial-block'>
                                <div className='tutorial-text-img'>
                                        <h2>Con este botón podrás descargar un excel con los datos que necesites</h2>
                                        <img src={descargarImg} alt="" />
                                </div>
                        </div>
                </div>
        )
}

export default Home