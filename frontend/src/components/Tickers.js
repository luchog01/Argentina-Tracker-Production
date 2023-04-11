import React from 'react'
import { useState, useEffect } from 'react'
import Ticker from './Ticker'
import './Tickers.css'

const Tickers = ({ selectTicker, selected, tickersMenu, toggleMenu, ikey }) => {
    const [tickers, setTickers] = useState({})
    const [searchTicker, setSearchTicker] = useState('')

    useEffect(() => {
        const fetchTickers = async () => {
            const res = await fetch(`http://${process.env.REACT_APP_PORT}/tickers?key=${ikey}`)
            const data = await res.json()
            if (data['detail'] !== 'Invalid Key.') {
                setTickers(data)
            }
        }

        fetchTickers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={tickersMenu ? 'tickers tickers-menu-active' : 'tickers'}>
            <input className='search' type="text" placeholder='Buscar' onChange={(event) => {
                setSearchTicker(event.target.value)
            }} />
            {Object.keys(tickers).filter((id) => {
                if (searchTicker === '') {
                    return id
                } else if (tickers[id].toUpperCase().includes(searchTicker.toUpperCase())) {
                    return id
                } return ''
            }).map((id, index) => (
                <Ticker key={id} id={id} name={tickers[id]} selectTicker={selectTicker} selected={selected} toggleMenu={toggleMenu} />
            ))}
        </div>
    )
}

export default Tickers