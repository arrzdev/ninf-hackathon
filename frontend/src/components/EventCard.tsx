import React from 'react';

import { LocationOn } from '@mui/icons-material';
import { useRouter } from 'next/router';

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
    const router = useRouter();

    const linker = () => {
        router.push(`/atividades/${id}`);
    };

    return (
        <div className='bg-blue-100 rounded-lg shadow-md p-6 mb-4 flex'>
            <div className='w-3/4 pr-4'>
                <h2 className='text-xl font-bold mb-2 text-blue-800'>
                    {title}
                </h2>
                <p className='text-gray-500 text-sm mb-2'>{date}</p>
                <div className='flex items-center text-gray-600'>
                    <LocationOn className='inline-block text-blue-800 mr-1' />
                    <p>{location}</p>
                </div>
            </div>
            <div className='w-1/4 flex justify-end'>
                <p className='text-gray-600'>{capacity} Vagas</p>
            </div>
        </div>
    );
};
