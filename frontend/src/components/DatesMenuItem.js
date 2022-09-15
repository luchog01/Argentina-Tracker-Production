import React from 'react'
import './DatesMenu.css'

const DatesMenuItem = ({date, dateId, setDates, toggleDatesMenu}) => {
  return (
    <li className='dates-menu-item' onClick={() => {
      setDates(date, dateId)
      toggleDatesMenu()}}>
        {date}
    </li>
  )
}

export default DatesMenuItem