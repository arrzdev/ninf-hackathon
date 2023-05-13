import React, { useEffect } from 'react';

import { ParkingCard } from '@/components/ParkingCard';

import { api } from '@/services/api';

interface ParkingCardData {
    name: string;
    currentCapacity: number;
    maxCapacity: number;
    address: string;
    location_id: number;
}

const Parking = () => {
    const [cardsData, setCardsData] = React.useState<ParkingCardData[]>([]);

    useEffect(() => {
        api.get<ParkingCardData[]>('/parking')
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
                {cardsData.length
                    ? cardsData.map((cardData, index) => (
                          <ParkingCard
                              key={index}
                              name={cardData.name}
                              currentCapacity={cardData.currentCapacity}
                              maxCapacity={cardData.maxCapacity}
                              location={cardData.address}
                              id={cardData.location_id}
                          />
                      ))
                    : [1, 2, 3].map((_, index) => (
                          <ParkingCard
                              key={index}
                              name=''
                              currentCapacity={0}
                              maxCapacity={0}
                              location=''
                              id={0}
                          />
                      ))}
            </div>
        </div>
    );
};

export default Parking;
