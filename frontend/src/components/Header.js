import React from 'react'
import "./Header.css"
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const Header = ({ title, toggleMenu }) => {
    return (
        <div className='header'>
            <FontAwesomeIcon icon={faBars} className='bars' onClick={() => toggleMenu()}/>
            <h1 className='title'>{title}</h1>
        </div>
    )
}

Header.propTypes = {
    title: PropTypes.string.isRequired
}

export default Header