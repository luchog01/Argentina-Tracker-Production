import React from 'react'
import './Sponsor.css'
import cocos from './images/cocos.jpg'
import cocos_mobile from './images/cocos-mobile.jpg'

const Sponsor = () => {
    return (
        <div className='sponsor-container' >
            <a href="https://cocos.capital" target="_blank" rel='noreferrer'>
                <img className='cocos' src={cocos} alt="" />
                <img className='cocos-mobile' src={cocos_mobile} alt="" />
            </a>
        </div>
    )
}

export default Sponsor