// components/TrafficChart.tsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export interface TrafficDataItem {
    date: string;
    rx: number;
    tx: number;
}

interface TrafficChartProps {
    data: TrafficDataItem[];
    loading: boolean;
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data, loading }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current && data.length > 0) {
            // Destroy previous chart instance before creating a new one
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const labels: string[] = data.map((item) => item.date);
            const receivedData: number[] = data.map((item) => item.rx);
            const sentData: number[] = data.map((item) => item.tx);

            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstanceRef.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Received Data (GB)',
                                data: receivedData,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Sent Data (GB)',
                                data: sentData,
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });
            }
        }

        // Cleanup function to destroy the chart instance when the component unmounts or data changes
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [data]); // Re-render the chart when the data prop changes

    if (loading) {
        return <div><b>Loading...</b></div>;
    }

    if (!data.length) {
        return <div>No data available.</div>;
    }

    return <canvas ref={chartRef} />;
};

export default TrafficChart;
