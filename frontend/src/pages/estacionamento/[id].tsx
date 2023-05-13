import React, { useEffect } from 'react';

import { useRouter } from 'next/router';
import { Graph, Progress } from '@/components/Graph';

import { LocationOn } from '@mui/icons-material';
import { GoBack } from '@/components/GoBack';

import { api } from '@/services/api';

interface ParkingCardData {
    name: string;
    currentCapacity: number;
    maxCapacity: number;
    address: string;
    location_id: number;
    last_snapshot: string;

    hourly: {
        hour: number;
        capacity: number;
    }[];
}

const ParkingId = () => {
    const router = useRouter();

    const [data, setData] = React.useState<ParkingCardData>();

    useEffect(() => {
        const id = Number(router.query.id);

        api.get<ParkingCardData>(`/parking/${id}`)
            .then(res => {
                setData(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    if (!data) {
        return (
            <div className='p-2'>
                <GoBack title='Estacionamento' />
            </div>
        );
    }

    return (
        <div className='p-2'>
            <GoBack title={data.name} />
            <div>
                <p className='text-center text-gray-500'>
                    <LocationOn className='inline-block mr-1' />
                    <span>{data.address}</span>
                </p>
            </div>
            <div className='mt-1'>
                <Progress
                    currentCapacity={data.currentCapacity}
                    maxCapacity={data.maxCapacity}
                />
            </div>
            <div className='mt-3'>
                <Graph
                    data={data.hourly}
                    maxCapacity={data.maxCapacity}
                    currentCapacity={data.currentCapacity}
                />
            </div>
            <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    className='max-w-full h-auto mx-auto mt-auto'
                    src={`data:image/jpeg;base64,${data.last_snapshot}`}
                    alt='Base64 Image'
                />
            </div>
        </div>
    );
};

export default ParkingId;
