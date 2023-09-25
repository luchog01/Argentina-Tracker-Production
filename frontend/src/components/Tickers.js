import React from 'react'
import { useState, useEffect } from 'react'
import Ticker from './Ticker'
import './Tickers.css'

const Tickers = ({ selectTicker, selected, tickersMenu, toggleMenu }) => {
    const [tickers, setTickers] = useState({})
    const [tickersFromServer, setTickersFromServer] = useState({})
    const [searchTicker, setSearchTicker] = useState('')

    useEffect(() => {
        const fetchTickers = async () => {
            const res = await fetch(`http://${process.env.REACT_APP_PORT}/tickers/`)
            const data = await res.json()

            const tickersList = Object.values(data);

            tickersList.sort();

            const tickersSorted = {};
            tickersList.forEach((valor, indice) => {
                tickersSorted[indice + 1] = valor;
            });

            setTickersFromServer(data)
            setTickers(tickersSorted)
        }

        fetchTickers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const findIdByName = (tickerName) => {
        for (const id in tickersFromServer) {
          if (tickersFromServer.hasOwnProperty(id) && tickersFromServer[id] === tickerName) {
            return id;
          }
        }
      }

    return (
        <div className={tickersMenu ? 'tickers tickers-menu-active' : 'tickers'}>
            <input className='search' type="text" placeholder='Buscar' onChange={(event) => {
                setSearchTicker(event.target.value)
            }} />
            {Object.keys(tickers).filter((key) => {
                if (searchTicker === '') {
                    return key
                } else if (tickers[key].toUpperCase().includes(searchTicker.toUpperCase())) {
                    return key
                } return ''
            }).map((key, index) => (
                <Ticker key={key} id={findIdByName(tickers[key])} name={tickers[key]} selectTicker={selectTicker} selected={selected} toggleMenu={toggleMenu} />
            ))}
        </div>
    )
}

export default Tickers