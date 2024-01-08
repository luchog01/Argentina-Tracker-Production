import React from 'react'
import './PeriodMenu.css'

const PeriodMenuItem = ({period, setPeriod, togglePeriodsMenu}) => {
  return (
    <li className='period-menu-item' onClick={() => {
        setPeriod(period)
        togglePeriodsMenu()}}>
        {period}
    </li>
  )
}

export default PeriodMenuItem