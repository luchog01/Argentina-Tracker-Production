import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Compare.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import DownloadButton from './DownloadButton'
import * as XLSX from 'xlsx'
import Loader from './Loader'

const Compare = ({ ikey }) => {
    const { id } = useParams()
    const { date1 } = useParams()
    const { date2 } = useParams()
    const [compareData, setCompareData] = useState({})
    const [fundsList, setFundsList] = useState([])
    const [descending, setDescending] = useState(true)
    const [sortedColumn, setSortedColumn] = useState(3)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFunds = async () => {
            const res = await fetch(`http://${process.env.REACT_APP_PORT}/compare/${id}/${date1}/${date2}`)
            const data = await res.json()
            setCompareData(data)

            const fundsListFromServer = data.table.slice(3)
            fundsListFromServer.sort((first, second) => {
                return second[3] - first[3];
            })
            setFundsList(fundsListFromServer)
            setLoading(false)
        }

        
        fetchFunds()
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, date1, date2])

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

    const changeColor = (data) => {
        const style = { color: '' }
        if (data < 0) {
            style['color'] = 'rgb(220, 0, 0)'
        } else if (data > 0) {
            style['color'] = 'green'
        } else {
            style['color'] = 'black'
        }
        return style
    }

    const exportFunds = () => {
        console.log('EXPORTAR')
        const fundsToExcel = [...fundsList]
        fundsToExcel.unshift(compareData.table[2])
        fundsToExcel.unshift(compareData.table[1])
        fundsToExcel.unshift(compareData.table[0])

        let wb = XLSX.utils.book_new(),
            ws = XLSX.utils.aoa_to_sheet(fundsToExcel)

        XLSX.utils.book_append_sheet(wb, ws, `${compareData.name} ${compareData.date}`)
        XLSX.writeFile(wb, `${compareData.name} ${compareData.date}.xlsx`)
    }

    return (
        <>
            {loading ? <Loader />
                :
                <div className='funds-container'>
                    <div className='initial-data'>
                        <h2 className='fund-title'>{compareData.name}</h2>
                        <h2 className='fund-subtitle'>Fechas: {compareData.date}</h2>
                        <div>
                            <h2 className='fund-subtitle'>Precio: {compareData.price}</h2>
                            <DownloadButton exportFunds={exportFunds} />
                        </div>
                    </div>
                    <div className='compare-grid'>
                        <h5 className='compare-data' onClick={() => sortByColumn(0)}>
                            Fondo
                            {sortedColumn === 0 &&
                                <FontAwesomeIcon icon={faArrowDown} className={descending ? 'arrow' : 'arrow rotated'} />
                            }
                        </h5>
                        <h5 className='compare-data' onClick={() => sortByColumn(1)}>
                            {date1}
                            {sortedColumn === 1 &&
                                <FontAwesomeIcon icon={faArrowDown} className={descending ? 'arrow' : 'arrow rotated'} />
                            }
                        </h5>
                        <h5 className='compare-data' onClick={() => sortByColumn(2)}>
                            {date2}
                            {sortedColumn === 2 &&
                                <FontAwesomeIcon icon={faArrowDown} className={descending ? 'arrow' : 'arrow rotated'} />
                            }
                        </h5>
                        <h5 className='compare-data' onClick={() => sortByColumn(3)}>
                            Qty Delta
                            {sortedColumn === 3 &&
                                <FontAwesomeIcon icon={faArrowDown} className={descending ? 'arrow' : 'arrow rotated'} />
                            }
                        </h5>
                        <h5 className='compare-data' onClick={() => sortByColumn(4)}>
                            % Delta
                            {sortedColumn === 4 &&
                                <FontAwesomeIcon icon={faArrowDown} className={descending ? 'arrow' : 'arrow rotated'} />
                            }
                        </h5>
                        <h5 className='compare-data'>Total</h5>
                        <h5 className='compare-data'>{compareData.table[1][1]}</h5>
                        <h5 className='compare-data'>{compareData.table[1][2]}</h5>
                        <h5 className='compare-data' style={changeColor(compareData.table[1][3])}>{compareData.table[1][3]}</h5>
                        <h5 className='compare-data' style={changeColor(compareData.table[1][4])}>{compareData.table[1][4]}</h5>
                        <h5 className='compare-data'>Promedio</h5>
                        <h5 className='compare-data'>{compareData.table[2][1]}</h5>
                        <h5 className='compare-data'>{compareData.table[2][2]}</h5>
                        <h5 className='compare-data' style={changeColor(compareData.table[2][3])}>{compareData.table[2][3]}</h5>
                        <h5 className='compare-data' style={changeColor(compareData.table[2][4])}>{compareData.table[2][4]}</h5>
                        {fundsList.map((fund) => (
                            <>
                                <h5 className='compare-data'>{fund[0]}</h5>
                                <h5 className='compare-data'>{fund[1]}</h5>
                                <h5 className='compare-data'>{fund[2]}</h5>
                                <h5 className='compare-data' style={changeColor(fund[3])}>{fund[3]}</h5>
                                <h5 className='compare-data' style={changeColor(fund[4])}>{fund[4]}</h5>
                            </>
                        ))}
                    </div>
                </div>
            }
        </>
    )
}

export default Compare