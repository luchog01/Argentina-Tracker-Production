import { React, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Tickers from './components/Tickers';
import DownloadButton from './components/DownloadButton';
import LineChart from './components/LineChart';
import Funds from './components/Funds';
import DatesMenu from './components/DatesMenu';
import Compare from './components/Compare';
import Footer from './components/Footer';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Verification from './components/Verification';
import { useKeyState } from './components/KeyState';
import { useValidKeyState } from './components/ValidKeyState';

function App() {
    const [selectedId, setSelectedId] = useState('1')
    const [tickersMenu, setTickersMenu] = useState(false)
    const [dateList, setDateList] = useState([])
    const [date1, setDate1] = useState('')
    const [date2, setDate2] = useState('')
    const [emptyDate, setEmptyDate] = useState(false)
    const [equalDates, setEqualDates] = useState(false)
    const [key, setKey] = useKeyState('key', 'invalid-key');
    const [validKey, setValidKey] = useValidKeyState('valid_key', false);

    const toggleMenu = () => {
        setTickersMenu(!tickersMenu)
    }

    const selectTicker = (id) => {
        setSelectedId(id)
        setDate1('')
        setDate2('')
        setEmptyDate(false)
        setEqualDates(false)
    }

    const exportFunds = () => {
        window.open(`http://${process.env.REACT_APP_PORT}/excel/${selectedId}`, '_blank', 'noopener,noreferrer')
    }

    const passDates = (dates) => {
        setDateList(dates)
    }

    const setDates = (date, dateId) => {
        if (dateId === 1) setDate1(date)
        else setDate2(date)
    }

    const openCompare = async (date1, date2) => {
        if (date1 === '' || date2 === '') {
            setEmptyDate(true)
            return
        } else if (date1 === date2) {
            setEqualDates(true)
            return
        }

        window.open(`/compare/${selectedId}/${date1}/${date2}`, '_blank', 'noopener,noreferrer');
    }
    
    const changeKey = (newKey, newValidKey) => {
        setKey(newKey)
        setValidKey(newValidKey)
        if (newValidKey) {
            window.open(`/graph`, '_self', 'noopener,noreferrer')
        }
    }

    return (
        <>
            <Header toggleMenu={toggleMenu} />
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/verification' exact element={<Verification changeKey={changeKey} />} />
                <Route path='/graph' exact element={
                    <>
                            <Tickers selectTicker={selectTicker} selected={selectedId} tickersMenu={tickersMenu} toggleMenu={toggleMenu} ikey={key}/>
                            {tickersMenu ? (
                                <div className="backdrop" onClick={toggleMenu} />
                                ) : (
                                    <div className="backdrop" style={{ display: "none" }} />
                                    )}
                            {validKey ? 
                                <div className='container'>
                                    <div className='linechart-container'>
                                        <DownloadButton exportFunds={exportFunds}/>
                                        <LineChart selectedId={selectedId} passDates={passDates} ikey={key}/>
                                    </div>
                                    <div className='dates-selector-container'>
                                        <DatesMenu date={date1} dateId={1} setDates={setDates} dateList={dateList} />
                                        <DatesMenu date={date2} dateId={2} setDates={setDates} dateList={dateList} />
                                        <button className={`compare-btn ${emptyDate && 'empty-date'} ${equalDates && 'equal-dates'}`} onClick={() => openCompare(date1, date2)}>Comparar</button>
                                    </div>
                                </div>
                            : <NotFound /> }
                    </>
                } />
                <Route path='/point/:id/:date' exact element={validKey ? <Funds ikey={key}/> : <NotFound /> } />
                <Route path='/compare/:id/:date1/:date2' exact element={validKey ? <Compare ikey={key}/> : <NotFound />} />
                <Route path='/*' element={<NotFound />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;