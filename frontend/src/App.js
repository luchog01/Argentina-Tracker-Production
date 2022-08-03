import { React, useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Tickers from './components/Tickers';
import LineChart from './components/LineChart';

function App() {
    const [tickers, setTickers] = useState({})
    const [selectedId, setSelectedId] = useState('1')
    const [selectedTicker, setSelectedTicker] = useState({
        "id": 0,
        "name": "",
        "funds": {
          "total": {}
        },
        "price": 0,
        "type": ""
    })
    const [tickersMenu, setTickersMenu] = useState(false)

    const fetchTickers = async () => {
        const res = await fetch('http://localhost:8000/tickers/')
        const data = await res.json()
        return data
    }

    const fetchTicker = async (id) => {
        const res = await fetch(`http://localhost:8000/tickers/${id}`)
        const data = await res.json()
        return data
    }

    useEffect(() => {
        const getTickers = async () => {
            const tickersFromServer = await fetchTickers()
            setTickers(tickersFromServer)
        }
        getTickers()

        const getTicker = async () => {
            const tickerSelected = await fetchTicker(selectedId)
            setSelectedTicker(tickerSelected)
        }
        getTicker()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const selectTicker = async (id) => {
        setSelectedId(id)
        const tickerSelected = await fetchTicker(id)
        setSelectedTicker(tickerSelected)
        console.log(tickerSelected)
    }

    const toggleMenu = () => {
        setTickersMenu(!tickersMenu)
    }

    return (
        <>
            <Header title='FCI Tracker' toggleMenu={toggleMenu}/>
            <div className='container'>
                <Tickers tickers={tickers} selectTicker={selectTicker} selected={selectedId} tickersMenu={tickersMenu} toggleMenu={toggleMenu}/>
                <LineChart ticker={selectedTicker.funds.total} name={selectedTicker.name} />
            </div>
        </>
    );
}

export default App;