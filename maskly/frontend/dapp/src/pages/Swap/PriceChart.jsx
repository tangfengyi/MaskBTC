import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const PriceChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetch('/api/prices')
            .then(response => response.json())
            .then(data => setChartData(data));
    }, []);

    useEffect(() => {
        if (chartData.length) {
            const ctx = document.getElementById('priceChart')?.getContext('2d');
            if (ctx) {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: chartData.map(d => d.date),
                        datasets: [{
                            label: 'Token Price',
                            data: chartData.map(d => d.price),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            fill: false,
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Token Price History'
                            }
                        }
                    }
                });
            }
        }
    }, [chartData]);

    return (
        <div>
            <h2>Price Chart</h2>
            <canvas id="priceChart"></canvas>
        </div>
    );
};

export default PriceChart;

[Response interrupted by a tool use result. Only one tool may be used at a time and should be placed at the end of the message.]
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const PriceChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetch('/api/prices')
            .then(response => response.json())
            .then(data => setChartData(data));
    }, []);

    useEffect(() => {
        if (chartData.length) {
            const ctx = document.getElementById('priceChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.map(d => d.date),
                    datasets: [{
                        label: 'Token Price',
                        data: chartData.map(d => d.price),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Token Price History'
                        }
                    }
                }
            });
        }
    }, [chartData]);

    return (
        <div>
            <h2>Price Chart</h2>
            <canvas id="priceChart"></canvas>
        </div>
    );
};

export default PriceChart;

