import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Funds.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown} from '@fortawesome/free-solid-svg-icons'
import DownloadButton from './DownloadButton'
import * as XLSX from 'xlsx'
import NotFound from './NotFound'

const Funds = ({ ikey }) => {
    const { id } = useParams()
    const { date } = useParams()
    const [fundsData, setFundsData] = useState({})
    const [fundsList, setFundsList] = useState([])
    const [descending, setDescending] = useState(true)
    const [sortedColumn, setSortedColumn] = useState(1)

    useEffect(() => {
        const fetchFunds = async () => {
            const res = await fetch(`http://${process.env.REACT_APP_PORT}/point/${id}/${date}`)
            const data = await res.json()
            setFundsData(data)
            
            const fundsListFromServer = data.funds.slice(2)
            fundsListFromServer.sort((first, second) => {
                return second[1] - first[1];
            })
            setFundsList(fundsListFromServer)
           
        }
        
        fetchFunds()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, date])

    const sortByColumn = (column) => {
        if (descending) {
            const sorted = [...fundsList].sort((first, second) =>
                first[column] > second[column] ? 1 : -1
            )
            setFundsList(sorted)
            setDescending(!descending)
        } else {
            const sorted = [...fundsList].sort((first, second) =>
                first[column] < second[column] ? 1 : -1
            )
            setFundsList(sorted)
            setDescending(!descending)
        }
        setSortedColumn(column)
    }

    const exportFunds = () => {
        const fundsToExcel = [...fundsList]
        fundsToExcel.unshift(fundsData.funds[1])
        fundsToExcel.unshift(fundsData.funds[0])
        fundsToExcel.unshift(['Fund', fundsData.date])

        let wb = XLSX.utils.book_new(),
            ws = XLSX.utils.aoa_to_sheet(fundsToExcel)

        XLSX.utils.book_append_sheet(wb, ws, `${fundsData.name} ${fundsData.date}`)
        XLSX.writeFile(wb, `${fundsData.name} ${fundsData.date}.xlsx`)
    }

    return (
        <>
            {Object.keys(fundsData).length > 0 ? 
                <div className='funds-container'>
                    <div className='initial-data'>
                        <h2 className='fund-title'>{fundsData.name}</h2>
                        <h2 className='fund-subtitle'>Fecha: {date}</h2>
                        <div>
                            <h2 className='fund-subtitle'>Precio: {fundsData.price}</h2>
                            <DownloadButton exportFunds={exportFunds}/>
                        </div>
                    </div>
                    <div className='funds-grid'>
                        <h4 className='fund' onClick={() => sortByColumn(0)}>
                            Fondo
                            {sortedColumn === 0 &&
                                <FontAwesomeIcon icon={faArrowDown} className={descending ? 'arrow' : 'arrow rotated'}/>
                            }
                        </h4>
                        <h4 className='fund' onClick={() => sortByColumn(1)}>
                            Cantidad
                            {sortedColumn === 1 &&
                                <FontAwesomeIcon icon={faArrowDown} className={descending ? 'arrow' : 'arrow rotated'}/>
                            }
                        </h4>
                        <h4 className='fund'>Total</h4>
                        <h4 className='fund'>{fundsData.funds[0][1]}</h4>
                        <h4 className='fund'>Promedio</h4>
                        <h4 className='fund'>{fundsData.funds[1][1]}</h4>
                        {fundsList.map((fund) => (
                            fund.map((data, index) => (
                                <h4 key={index} className='fund'>{data}</h4>
                            ))
                        ))}
                    </div>
                </div> 
        : <NotFound/> }
        </>
    )
}

export default Funds