import React from 'react'
//import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import './LineChart.css'

//Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const LineChart = ({ticker, name}) => {
    return (
        <div className='line-chart'>
            <Line
                data={{
                    labels: ticker.dates,
                    datasets: [{
                        label: name,
                        data: ticker.qty,
                        borderColor: '#00ab14',
                        borderWidth: 1,
                        pointBackgroundColor: 'rgba(0, 191, 29, 0.3)',
                        pointRadius: 4.5,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: 'rgba(0, 191, 29, 1)',
                        fill: false,
                        tension: 0
                    }]
                }}
                options={{
                    scales: {
                        y: {
                            ticks: {
                                color: '#ebebeb'
                            },
                            grid: {
                                color: '#404040'
                            },
                            beginAtZero: true
                        },
                        x: {
                            ticks: {
                                color: '#ebebeb'
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
                            color: '#ebebeb',
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
                    }
                }}
            />
        </div>
    )
}

export default LineChart