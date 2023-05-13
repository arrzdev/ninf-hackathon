import React from 'react';

import { EventCard } from '@/components/EventCard';

const Beach = () => {
  const eventsData = [
    {
      date: '2021-08-01',
      title: 'Limpar a praia',
      location: 'Praia da Costa da Caparica',
      capacity: 120,
      id: 1,
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-4'>Atividades</h1>
      <div className='grid grid-cols-1 gap-4'>
        {eventsData.map((cardData, index) => (
          <EventCard key={index} {...cardData} />
        ))}
      </div>
    </div>
  );
};

export default Beach;
