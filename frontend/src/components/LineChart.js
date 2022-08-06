import React from 'react'
//import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import './LineChart.css'

//Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const LineChart = ({ ticker, name, onClick }) => {

    const data = {
        labels: ticker.dates,
        datasets: [{
            label: name,
            data: ticker.qty,
            borderColor: 'rgba(0, 98, 255, 1)',
            borderWidth: 1,
            pointBackgroundColor: 'rgba(0, 98, 255, 1)',
            pointRadius: 6,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'rgba(0, 98, 255, 1)',
            fill: false,
            tension: 0
        }]
    }

    return (
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
                            },
                            beginAtZero: true
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
                            text: name,
                            color: '#000000',
                            font: {
                                size: 18
                            }
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            mode: 'index',
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
                                    newLineArray.push(`Precio: ${ticker.prices[index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)
                                    return newLineArray
                                }
                            },
                            displayColors: false
                        }
                    },
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    onClick: (evt, element) => onClick(element)
                }}
            />
        </div>
    )
}

export default LineChart