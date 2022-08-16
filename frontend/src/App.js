import { React, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Tickers from './components/Tickers';
import LineChart from './components/LineChart';
import Funds from './components/Funds';
import Footer from './components/Footer';

function App() {
    const [selectedId, setSelectedId] = useState('1')
    const [tickersMenu, setTickersMenu] = useState(false)

    const toggleMenu = () => {
        setTickersMenu(!tickersMenu)
    }

    const selectTicker = async (id) => {
        setSelectedId(id)
    }

    return (
        <>
            <Header toggleMenu={toggleMenu} />
            <Routes>
                <Route path='/' exact element={
                    <>
                        <Tickers selectTicker={selectTicker} selected={selectedId} tickersMenu={tickersMenu} toggleMenu={toggleMenu} />
                        <div className='container'>
                            <LineChart selectedId={selectedId} />
                        </div>
                    </>
                } />
                <Route path='/:id/:date' exact element={<Funds />} />
            </Routes>
            <Footer/>
        </>
    );
}

export default App;