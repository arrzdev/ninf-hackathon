import React from 'react';
import { LocationOn } from '@mui/icons-material';

interface IEventProps {
    date: string;
    title: string;
    location: string;
    capacity: number;
    id: number; 
}

export const EventCard = ({
    date,
    title,
    location,
    capacity,
    id,
}: IEventProps) => {
    return (
        <div className='bg-blue-100 rounded-lg shadow-md p-6 mb-4 flex'>
            <div className='w-3/4 pr-4'>
                <h2 className='text-xl font-bold mb-2 text-blue-800'>
                    {title}
                </h2>
                <p className='text-gray-500 text-sm mb-2'>{date}</p>
                {location ? (
                <div className='flex items-center text-gray-600'>
                    <LocationOn className='inline-block text-blue-800 mr-2 animate-pulse' />
                    <p>{location}</p>
                </div>
                ):(
                  <div className='animate-pulse'>
                    <div className='h-5 bg-gray-300 rounded w-1/2 mb-2'></div>
                  </div>
                )}
            </div>
            <div className='w-1/4 flex justify-end'>
                <p className='text-gray-600'>{capacity} Vagas</p>
            </div>
        </div>
    );
};
