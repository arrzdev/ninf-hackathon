import React, { useState } from 'react';
import { LocationOn } from '@mui/icons-material';
import { nextApi } from '@/services/api';

interface IEventProps {
    date: string;
    title: string;
    location: string;
    capacity: number;
    predicted_capacity: number;
    id: string;
}

export const EventCard = ({
    date,
    title,
    location,
    capacity,
    predicted_capacity,
    id,
}: IEventProps) => {
    const [isInterested, setIsInterested] = useState(false);
    const [loading, setLoading] = useState(false);

    const [c, setC] = useState(capacity);

    const handleButtonClick = () => {
        setLoading(true);

        setC(c - 1);
        setIsInterested(true);
        setLoading(false);

        nextApi
            .post(
                '/joinEvent',
                {
                    id,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                }
            )
            .then(() => {
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <div className='bg-blue-100 rounded-lg shadow-md p-6 mb-4 flex flex-col md:flex-row'>
            <div className='mb-4 md:w-3/4 pr-4 md:pr-4'>
                <h2 className='text-xl font-bold mb-2 text-blue-800'>
                    {title}
                </h2>
                <p className='text-gray-500 text-sm mb-2'>{date}</p>
                {location ? (
                    <div className='flex items-center text-gray-600'>
                        <LocationOn className='inline-block text-blue-800 mr-2 animate-pulse' />
                        <p>{location}</p>
                    </div>
                ) : (
                    <div className='animate-pulse'>
                        <div className='h-5 bg-gray-300 rounded w-1/2 mb-2'></div>
                    </div>
                )}
            </div>
            <div className='md:w-1/4 flex flex-col md:items-start md:justify-end'>
                <p className='text-gray-600 mb-2 md:mb-0'>{c} Vagas</p>
                <button
                    className='px-4 py-2 rounded bg-blue-800 text-white disabled:bg-blue-500'
                    onClick={() => handleButtonClick()}
                    disabled={loading || isInterested}
                >
                    {isInterested ? 'Inscrito' : 'Estou interessado'}
                </button>
            </div>
        </div>
    );
};
