import React from 'react'
import './Tickers.css'

const Ticker = ({id, name, selectTicker, selected, toggleMenu}) => {
  return (
    <div className={id === selected ? 'ticker selected' : 'ticker'} onClick={() => {
      selectTicker(id)
      toggleMenu()
    }}>{name}</div>
  )
}

export default Ticker