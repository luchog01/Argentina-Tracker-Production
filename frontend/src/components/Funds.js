import React from 'react'
import './Funds.css'

const Funds = ({ date, price, funds }) => {
    return (
        <div className='funds'>
            <h2>{date}</h2>
            <h3>Precio: {price}</h3>
            <h3>Fondos:</h3>
            {Object.keys(funds).map((fund, index) => (
                <div key={fund} className='fund'>
                    <h3>{fund}</h3>
                    <h3>Cantidad: {funds[fund]}</h3>
                </div>
            ))}
        </div>
    )
}

export default Funds