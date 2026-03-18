import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend, Filler
);

const DashboardLineChart = ({ trendData }) => {
    const lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    const lineChartData = {
        labels: trendData?.labels || [],
        datasets: [
            {
                label: 'Albums',
                data: trendData?.albums || [],
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                tension: 0.4
            },
            {
                label: 'Tracks',
                data: trendData?.tracks || [],
                borderColor: 'rgba(56, 189, 248, 1)',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                pointBackgroundColor: 'rgba(56, 189, 248, 1)',
                tension: 0.4
            },
            {
                label: 'Labels',
                data: trendData?.labelsTrend || [],
                borderColor: 'rgba(132, 204, 22, 1)',
                backgroundColor: 'rgba(132, 204, 22, 0.1)',
                pointBackgroundColor: 'rgba(132, 204, 22, 1)',
                tension: 0.4
            }
        ]
    };

    return <Line options={lineChartOptions} data={lineChartData} height={70} id='dashLineChart' redraw={true} />;
};

export default DashboardLineChart;
