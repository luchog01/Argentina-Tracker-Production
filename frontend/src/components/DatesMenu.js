import { React, useState } from 'react'
import DatesMenuItem from './DatesMenuItem'
import './DatesMenu.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

const DatesMenu = ({date, dateId, setDates, dateList}) => {
    const [datesMenu, setDatesMenu] = useState(false)

    const toggleDatesMenu = () => setDatesMenu(!datesMenu)

    return (
        <div className='dates-menu-container'>
            <h3>Elegir fecha {dateId}:</h3>
            <div className='dates-menu'>
                <div className='menu-trigger' onClick={() => toggleDatesMenu()}>
                    <p>{date === '' ? 'Seleccionar fecha' : date}</p>
                    <FontAwesomeIcon icon={faAngleDown} className='arrow'/>
                </div>
                <ul className='dates-menu-content'>
                    {datesMenu && dateList.map((date, index) => (
                        <DatesMenuItem key={index} date={date} dateId={dateId} setDates={setDates} toggleDatesMenu={toggleDatesMenu} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default DatesMenu