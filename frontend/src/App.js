import { React, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Sponsor from './components/Sponsor'
import Graph from './components/Graph'
import Tickers from './components/Tickers';
import Funds from './components/Funds';
import Compare from './components/Compare';
import Footer from './components/Footer';
import Home from './components/Home';
import NotFound from './components/NotFound';

function App() {
    const [tickerId, setTickerId] = useState('1')
    const [tickersMenu, setTickersMenu] = useState(false)

    const toggleMenu = () => {
        setTickersMenu(!tickersMenu)
    }

    const changeTickerId = (id) => {
        setTickerId(id)
    }

     const openTicker = (id) => {
        window.open(`/graph/${id}`, '_self', 'noopener,noreferrer')
    }

    return (
        <>
            <Header toggleMenu={toggleMenu} />
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/graph/:id' exact element={
                    <>
                            <Tickers openTicker={openTicker} selected={tickerId} tickersMenu={tickersMenu} toggleMenu={toggleMenu}/>
                            {tickersMenu ? (
                                <div className="backdrop" onClick={toggleMenu} />
                                ) : (
                                    <div className="backdrop" style={{ display: "none" }} />
                                    )}
                            <Sponsor />
                            <Graph changeTickerId={changeTickerId}/>
                    </>
                } />
                <Route path='/point/:id/:date' exact element={
                    <>
                        <Tickers openTicker={openTicker} selected={tickerId} tickersMenu={tickersMenu} toggleMenu={toggleMenu}/>
                        {tickersMenu ? (
                            <div className="backdrop" onClick={toggleMenu} />
                            ) : (
                                <div className="backdrop" style={{ display: "none" }} />
                                )}
                        <Funds/>
                    </>
                } />
                <Route path='/compare/:id/:date1/:date2' exact element={
                    <>
                        <Tickers openTicker={openTicker} selected={tickerId} tickersMenu={tickersMenu} toggleMenu={toggleMenu}/>
                        {tickersMenu ? (
                            <div className="backdrop" onClick={toggleMenu} />
                            ) : (
                                <div className="backdrop" style={{ display: "none" }} />
                                )}
                        <Compare/>
                    </>
                } />
                <Route path='/*' element={<NotFound />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;