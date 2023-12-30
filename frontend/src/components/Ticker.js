import React from 'react'
import './Tickers.css'

const Ticker = ({id, name, openTicker, selected, toggleMenu}) => {
  return (
    <div className={id === selected ? 'ticker selected' : 'ticker'} onClick={() => {
      openTicker(id)
      toggleMenu()
    }}>{name}</div>
  )
}

export default Ticker