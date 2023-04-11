import './Verification.css'
import { useState } from 'react'
import verificationBg from './images/verification-bg.webp'

import React from 'react'

const Verification = ({ changeKey }) => {
    const [key, setKey] = useState('')
    const [invalidKey, setInvalidKey] = useState(false)

    const verificateKey = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://${process.env.REACT_APP_PORT}/login?key=${key}&internal=false`, {
            method: "POST"
        })
        const data = await res.json()

        if (data['detail'] !== 'Invalid Key.') {
            changeKey(key, true)
        } else {
            changeKey(key, false)
            setInvalidKey(true)
        }
    }

    return (
        <div className='verification-container' style={{ backgroundImage: `url(${verificationBg})`, backgroundPosition: 'center' }}>
            <div className='code-container'>
                <form className='code-form' onSubmit={verificateKey}>
                    <label>
                        Introduce el código:
                    </label>
                    <input className='code-input' type="text" required value={key} onChange={(e) => setKey(e.target.value)} />
                    <button className={`${invalidKey && 'incorrect-key'}`}>Enviar</button>
                </form>
            </div>
        </div>
    )
}

export default Verification