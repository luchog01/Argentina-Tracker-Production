import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './Compare.css'

const Compare = () => {
    const { id } = useParams()
    const { date1 } = useParams()
    const { date2 } = useParams()
    const [compareData, setCompareData] = useState({})

    useEffect(() => {
        const fetchFunds = async () => {
            const res = await fetch(`http://52.200.228.178:8000/compare/${id}/${date1}/${date2}`)
            const data = await res.json()
            setCompareData(data)
        }

        fetchFunds()
    }, [id, date1, date2])

    return (
        <>
            {Object.keys(compareData).length > 0 &&
                <div className='compare-container'>
                    <div className='compare-initial-data'>
                        <h2>{compareData.name}</h2>
                        <h2>Fechas: {compareData.date}</h2>
                        <h2>Precio: {compareData.price}</h2>
                    </div>
                    <div className='compare-grid'>
                        <h5 className='compare-data'>Fondo</h5>
                        <h5 className='compare-data'>{date1}</h5>
                        <h5 className='compare-data'>{date2}</h5>
                        <h5 className='compare-data'>Qty Delta</h5>
                        <h5 className='compare-data'>% Delta</h5>
                        {compareData.table.slice(1).map((fund, index) => (
                            fund.map((data, index) => (
                                <h5 key={index} className='compare-data'>{data === 'avg' ? 'Promedio' : data}</h5>
                            ))
                        ))}
                    </div>
                </div>
            }
        </>
    )
}

export default Compare