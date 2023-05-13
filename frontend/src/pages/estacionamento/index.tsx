import React, { useEffect } from 'react';

import { ParkingCard } from '@/components/ParkingCard';

import { api } from '@/services/api';
import { CastRounded } from '@mui/icons-material';

interface ParkingCardData {
    name: string;
    current_capacity: number;
    max_capacity: number;
    address: string;
    location_id: number;
}

const Parking = () => {
    const [cardsData, setCardsData] = React.useState<ParkingCardData[]>([]);

    useEffect(() => {
      api.get<ParkingCardData[]>('/locations')
            .then(res => {
                setCardsData(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-4'>Estacionamento</h1>

            <div className='grid grid-cols-1 gap-4'>
                {cardsData.length != 0
                    ? cardsData.map((cardData, index) => (
                          <ParkingCard
                              key={index}
                              name={cardData.name}
                              currentCapacity={cardData.current_capacity}
                              maxCapacity={cardData.max_capacity}
                              location={cardData.address}
                              id={cardData.location_id}
                          />
                      ))
                    : [1, 2, 3].map((_, index) => (
                      // Return skeleton/loading state
                    <div key={index} className={`rounded-lg shadow-lg p-4 bg-gray-200`}>
                      <div className='animate-pulse'>
                        <div className='h-4 bg-gray-300 rounded w-2/3 mb-2'></div>
                        <div className='h-4 bg-gray-300 rounded w-1/3 mb-4'></div>
                        <div className='h-2 bg-gray-300 rounded w-1/2 mb-2'></div>
                        <div className='h-2 bg-gray-300 rounded w-2/3'></div>
                      </div>
                    </div>
                  ))}
            </div>
        </div>
    );
};

export default Parking;
