import { React, useState } from 'react'
import PeriodMenuItem from './PeriodMenuItem'
import './PeriodMenu.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

const PeriodMenu = ({period, setPeriod, periodList}) => {
    const [periodsMenu, setPeriodsMenu] = useState(false)

    const togglePeriodsMenu = () => setPeriodsMenu(!periodsMenu)

    return (
        <div className='period-menu-container'>
            <h3>Periodo:</h3>
            <div className='period-menu'>
                <div className='period-menu-trigger' onClick={() => togglePeriodsMenu()}>
                    <p>{period}</p>
                    <FontAwesomeIcon icon={faAngleDown} className='arrow'/>
                </div>
                <ul className='period-menu-content'>
                    {periodsMenu && periodList.map((period, index) => (
                        <PeriodMenuItem key={index} period={period} setPeriod={setPeriod} togglePeriodsMenu={togglePeriodsMenu} />
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default PeriodMenu