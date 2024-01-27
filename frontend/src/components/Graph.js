import { React, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import DownloadButton from './DownloadButton';
import LineChart from './LineChart';
import PeriodMenu from './PeriodMenu';
import DatesMenu from './DatesMenu';
import Loader from './Loader'
import './Graph.css'

const Graph = ({ changeTickerId }) => {
    const { id } = useParams()
    const [ticker, setTicker] = useState({
        "id": 0,
        "name": "",
        "funds": {
            "total": {},
            "avg" : {}
        },
        "price": 0,
        "type": ""
    })
    const [backendPeriod, setBackendPeriod] = useState('all')
    const [period, setPeriod] = useState('Todo')
    const [backendPeriodList] = useState(['month', 'three_months', 'six_months', 'year', 'all'])
    const [periodList] = useState(['Mes', '3 Meses', '6 Meses', 'Año', 'Todo'])
    const [dateList, setDateList] = useState([])
    const [date1, setDate1] = useState('')
    const [date2, setDate2] = useState('')
    const [emptyDate, setEmptyDate] = useState(false)
    const [equalDates, setEqualDates] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTicker = async () => {
            const res = await fetch(`http://${process.env.REACT_APP_PORT}/tickers/${id}?period=${backendPeriod}`)
            const data = await res.json()

            if (data.funds.total.dates.length % 2 === 0 && data.funds.total.dates.length > 34) {
                data.funds.total.dates.shift()
                data.funds.total.prices.shift()
                data.funds.total.qty.shift()
                data.funds.avg.dates.shift()
                data.funds.avg.prices.shift()
                data.funds.avg.qty.shift()
            }

            setTicker(data)

            const descendingDates = data.funds.total.dates.slice().reverse()
            setDateList(descendingDates)
        }
        
        fetchTicker()
        changeTickerId(id)
        setLoading(false)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, backendPeriod])

    const exportFunds = () => {
        window.open(`http://${process.env.REACT_APP_PORT}/excel/${id}`, '_blank', 'noopener,noreferrer')
    }

    const setPeriod_ = (period) => {
        setPeriod(period)
        const periodIndex = periodList.indexOf(period)
        setBackendPeriod(backendPeriodList[periodIndex])
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

        window.open(`/compare/${id}/${date1}/${date2}`, '_blank', 'noopener,noreferrer');
    }

    return (
        <>
        {loading ? <Loader/>
                : 
            <div className='container'>
                <div className='linechart-container'>
                    <div className='linechart-tools'>
                        <PeriodMenu period={period} setPeriod={setPeriod_} periodList={periodList} />
                        <DownloadButton exportFunds={exportFunds} />
                    </div>
                    <LineChart ticker={ticker} id={id}/>
                </div>
                <div className='dates-selector-container'>
                    <DatesMenu date={date1} dateId={1} setDates={setDates} dateList={dateList} />
                    <DatesMenu date={date2} dateId={2} setDates={setDates} dateList={dateList} />
                    <button className={`compare-btn ${emptyDate && 'empty-date'} ${equalDates && 'equal-dates'}`} onClick={() => openCompare(date1, date2)}>Comparar</button>
                </div>
            </div> }
        </>
    )
}

export default Graph