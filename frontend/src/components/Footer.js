import React from 'react'
import './Footer.css'

const Footer = () => {
    return (
        <div className='footer-container'>
            <div className='footer-title-container'>
                <img alt='' src={window.location.origin + '/logo.png'} className='footer-icon' />
                <h3 className='footer-title'>FCI Tracker</h3>
            </div>
            <div>
                <p>Desarrollo:</p>
                <p>Email: lucigar01@gmail.com</p>
                <p>Telefono: 1141609973</p>
            </div>
            <div>
                <p>Diseño Web:</p>
                <p>Email: lucasjang01@gmail.com</p>
                <p>Telefono: 1151102973</p>
            </div>
            <div>
                <p>Diseño Grafico:</p>
                <p>Email: No Available</p>
                <p>Telefono: 1136295094</p>
            </div>
        </div>
    )
}

export default Footer