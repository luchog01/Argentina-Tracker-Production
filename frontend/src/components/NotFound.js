import React from 'react'
import "./NotFound.css"

const NotFound = () => {
  return (
    <div className='notfound-container'>
        <div className='notfound-text'>
                <h1>No pudimos encontrar la página que estas buscando.</h1>
                <h2>Por favor verifique que la url este escrita correctamente.</h2>
                <h2>O vuelve a la <a href="/">pagina principal</a> y navegue hasta la página deseada desde ahi.</h2>
                
        </div>
    </div>
  )
}

export default NotFound