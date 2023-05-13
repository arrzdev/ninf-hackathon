import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

interface IGraphProps {
    data: {
        hour: number;
        capacity: number;
    }[];
    maxCapacity: number;
    currentCapacity: number;
}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const formatHour = (hour: number) => {
    if (hour < 10) {
        return `0${hour}`;
    }
    return `${hour}`;
};

export const Graph = (props: IGraphProps) => {
    const labels = props.data.map(hour => formatHour(hour.hour));
    const capacities = props.data.map(hour => hour.capacity);

    const green_color = 'rgba(0, 255, 0, 0.8)';
    const green_border = 'rgba(0, 255, 0, 0.2)';
    const yellow_color = 'rgba(255, 255, 0, 0.8)';
    const yellow_border = 'rgba(255, 255, 0, 0.2)';
    const red_color = 'rgba(255, 0, 0, 0.8)';
    const red_border = 'rgba(255, 0, 0, 0.2)';

    const colorDecider = (capacity: number, maxCapacity: number) => {
        if (capacity < maxCapacity * 0.6) {
            return [green_color, green_border];
        } else if (capacity < maxCapacity * 0.9) {
            return [yellow_color, yellow_border];
        } else {
            return [red_color, red_border];
        }
    };

    const [c, b] = colorDecider(props.currentCapacity, props.maxCapacity);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Capacity',
                data: capacities,
                fill: false,
                backgroundColor: c,
                borderColor: b,
            },
        ],
    };

    const options = {
        maintainAspectRatio: false, // Allow chart to take full width of the container
        plugins: {
            legend: {
                display: false, // Hide the legend
            },
        },
        scales: {
            x: {
                display: true, // Hide the X-axis labels
            },
            y: {
                display: true, // Hide the Y-axis labels
                beginAtZero: true,
                max: props.maxCapacity,
            },
        },
    };

    return (
        <div className='w-full h-40 md:w-64 md:h-56 p-2'>
            <Line data={data} options={options} />
        </div>
    );
};

interface ICircularProgressProps {
    maxCapacity: number;
    currentCapacity: number;
}

export const Progress = ({
    maxCapacity,
    currentCapacity,
}: ICircularProgressProps) => {
    const color = () => {
        if (currentCapacity < maxCapacity * 0.6) {
            return 'bg-green-500';
        } else if (currentCapacity < maxCapacity * 0.9) {
            return 'bg-yellow-500';
        }
        return 'bg-red-500';
    };

    return (
        <div className='flex flex-col items-center'>
            <p className='text-lg font-bold mt-2'>
                {currentCapacity}/{maxCapacity}
            </p>
            <div className='w-80 h-1 bg-gray-300 mt-2'>
                <div
                    className={'h-full ' + color()}
                    style={{
                        width: `${(currentCapacity / maxCapacity) * 100}%`,
                    }}
                ></div>
            </div>
        </div>
    );
};
