import React, { useEffect, useState } from 'react';

import { EventCard } from '@/components/EventCard';
import { useRouter } from 'next/router';
import { nextApi } from '@/services/api';
import Link from 'next/link';

interface IReqData {
    _id: string;
    name: string;
    date: string;
    location: string;
    current_capacity: number;
    maximum_capacity: number;
    hour: string;
}

const Beach = () => {
    const router = useRouter();

    const [activities, setActivities] = useState<IReqData[]>([]);

    const [locationMapper, setLocationMapper] = useState<any>({});

    useEffect(() => {
        const t = localStorage.getItem('token');

        if (!t) {
            router.push('/login');
        }

        nextApi
            .get('/listEvent', {
                headers: {
                    Authorization: t,
                },
            })
            .then(response => {
                setActivities(response.data.data);
            });

        nextApi
            .get('/listLocation', {
                headers: {
                    Authorization: t,
                },
            })
            .then(response => {
                setLocationMapper(response.data.data);
            });
    }, [router]);

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-4'>Atividades</h1>
            <div className='grid grid-cols-1 gap-4'>
                {activities?.map((cardData, index) => (
                    // @ts-ignore
                    <EventCard
                        key={index}
                        capacity={
                            cardData.maximum_capacity -
                            cardData.current_capacity
                        }
                        date={cardData.date + ' ' + cardData.hour}
                        title={cardData.name}
                        location={locationMapper[cardData.location]}
                    />
                ))}
            </div>
            <button
                onClick={() => router.push('/atividades/criar')}
                className='cursor-pointer text-xl fixed right-8 bottom-24 bg-blue-500 hover:bg-blue-400 text-white px-6 py-4 rounded-full'
            >
                +
            </button>
        </div>
    );
};

export default Beach;
