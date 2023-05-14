import React, { useState, useEffect } from 'react';
import { ParkingCard } from '@/components/ParkingCard';
import { api } from '@/services/api';
import { NextPage } from 'next';
import { Navbar } from '@/components/Navbar';

interface ParkingCardData {
  name: string;
  current_capacity: number;
  max_capacity: number;
  address: string;
  location_id: number;
}

interface IProps {
  data: ParkingCardData[];
}

const Parking: NextPage<IProps> = ({ data }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    setFilteredData(
      data.filter((cardData) =>
        cardData.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <Navbar />
      <h1 className='text-3xl font-bold mb-4 text-start'>Estacionamento</h1>
      <div className='flex mb-4'>
        <input
          type='text'
          placeholder='Search by name'
          className='rounded-lg px-4 py-2 bg-gray-200 text-gray-800 w-full'
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className='grid grid-cols-1 gap-4 mb-16'>
        {filteredData.length ? (
          filteredData.map((cardData, index) => (
            <ParkingCard
              key={index}
              name={cardData.name}
              currentCapacity={cardData.max_capacity - cardData.current_capacity}
              maxCapacity={cardData.max_capacity}
              location={cardData.address}
              id={cardData.location_id}
            />
          ))
        ) : (
          // Return skeleton/loading state
          [1, 2, 3, 4, 5, 6].map((_, index) => (
            <div
              key={index}
              className='rounded-lg shadow-lg p-4 bg-gray-200 text-gray-800'
            >
              <div className='animate-pulse'>
                <div className='h-4 bg-gray-300 rounded w-2/3 mb-2'></div>
                <div className='h-4 bg-gray-300 rounded w-1/3 mb-4'></div>
                <div className='h-2 bg-gray-300 rounded w-1/2 mb-2'></div>
                <div className='h-2 bg-gray-300 rounded w-2/3'></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const res = await api.get<ParkingCardData[]>('/locations');

  if (!res?.data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: res.data,
    },
  };
};

export default Parking;
