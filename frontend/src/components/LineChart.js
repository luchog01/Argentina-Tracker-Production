import { React, useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
/* eslint-disable no-unused-vars */
import { Chart as ChartJS } from 'chart.js/auto'
import NotFound from './NotFound'
import './LineChart.css'

const LineChart = ({ selectedId, passDates, ikey }) => {
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
    const [validKey, setValidKey] = useState(false)

    useEffect(() => {
        const fetchTicker = async (id) => {
            const res = await fetch(`http://${process.env.REACT_APP_PORT}/tickers/${id}?key=${ikey}`)
            const data = await res.json()
            if (data['detail'] !== 'Invalid Key.') {
                    setTicker(data)
                    passDates(data.funds.total.dates)
                    setValidKey(true)
            }
        }

        fetchTicker(selectedId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId])

    const openDetail = async (element) => {
        if (element.length > 0) {
            const date = ticker.funds.total.dates[element[0].index]
            window.open(`/point/${selectedId}/${date}`, '_blank', 'noopener,noreferrer');
        }
    }

    const data = {
        labels: ticker.funds.total.dates,
        datasets: [{
            label: "Total",
            data: ticker.funds.total.qty,
            borderColor: 'rgba(0, 98, 255, 1)',
            borderWidth: 1,
            pointBackgroundColor: 'rgba(0, 98, 255, 1)',
            pointRadius: 7,
            pointHoverRadius: 9,
            fill: false,
            tension: 0
        },
        {
            label: "Promedio",
            data: ticker.funds.avg.qty,
            borderColor: 'rgba(0, 174, 232, 1)',
            borderWidth: 1,
            pointBackgroundColor: 'rgba(0, 174, 232, 1)',
            pointRadius: 7,
            pointHoverRadius: 9,
            fill: false,
            tension: 0,
            hidden: true
        }]
    }

    return (
        <>
            <div className='line-chart'>
                <Line
                    data={data}
                    options={{
                        scales: {
                            y: {
                                ticks: {
                                    color: '#000000',
                                    font: {
                                        size: 14,
                                        weight: 'bolder'
                                    }
                                },
                                grid: {
                                    color: '#404040'
                                }
                            },
                            x: {
                                ticks: {
                                    color: '#000000',
                                    font: {
                                        size: 14,
                                        weight: 'bolder'
                                    }
                                },
                                grid: {
                                    color: '#404040'
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: ticker.name,
                                color: '#000000',
                                font: {
                                    size: 18
                                }
                            },
                            legend: {
                                display: true,
                                onHover: (event, element) => {
                                    event.native.target.style.cursor = 'pointer'
                                }
                            },
                            tooltip: {
                                mode: 'nearest',
                                intersect: true,
                                titleFont: {
                                    size: 16
                                },
                                bodyFont: {
                                    size: 12
                                },
                                callbacks: {
                                    title: (context) => {
                                        return context[0].label
                                    },
                                    label: (context) => {
                                        const newLineArray = []
                                        const index = context.dataIndex
                                        newLineArray.push(`Cantidad: ${context.dataset.data[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
                                        newLineArray.push(`Precio: ${ticker.funds.total.prices[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
                                        return newLineArray
                                    }
                                },
                                displayColors: false
                            }
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true,
                            
                        },
                        onClick: (event, element) => openDetail(element),
                        onHover: (event, element) => {
                            event.native.target.style.cursor = element[0] ? 'pointer' : 'default'
                        }
                    }}
                />
            </div>
        </>
    )
}

export default LineChart