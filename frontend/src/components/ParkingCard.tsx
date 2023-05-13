import React from 'react';

import { LocationOn } from '@mui/icons-material';
import Link from 'next/link';

interface ICardProps {
    name: string;
    currentCapacity: number;
    maxCapacity: number;
    location: string;
    id: number;
}

export const ParkingCard = ({
    name,
    currentCapacity,
    maxCapacity,
    location,
    id,
}: ICardProps) => {
    const capacityPercentage = (currentCapacity / maxCapacity) * 100;
    let cardColorClass = '';

    if (capacityPercentage >= 90) {
        cardColorClass = 'bg-red-200';
    } else if (capacityPercentage >= 60) {
        cardColorClass = 'bg-yellow-200';
    } else {
        cardColorClass = 'bg-green-200';
    }

    const capacityText = `${currentCapacity}/${maxCapacity}`;

    return (
        <Link
            href={`/estacionamento/${id}`}
            className={`rounded-lg shadow-lg p-4 ${cardColorClass}`}
        >
            <div className='flex justify-between'>
                <div className='text-left'>
                    <h2 className='text-xl font-bold mb-2'>{name}</h2>
                    <p className='text-gray-500'>
                        <LocationOn className='inline-block mr-1' />
                        <span>{location}</span>
                    </p>
                </div>
                <div className='text-right'>
                    <p className='text-lg font-semibold'>{capacityText}</p>
                </div>
            </div>
        </Link>
    );
};
