import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { nextApi } from '@/services/api';
import { GoBack } from '@/components/GoBack';

const CreateEvent = () => {
    const router = useRouter();

    const [locationMapper, setLocationMapper] = useState<any>({});

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            router.push('/login');
        }

        nextApi
            .get('/listLocation', {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            .then(response => {
                setLocationMapper(response.data.data);
            });
    }, [router]);

    const [form, setForm] = useState({
        name: '',
        date: '',
        location: '',
        capacity: '',
        hour: '',
    });

    const handleChange = (event: any) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();

        console.log(form);

        nextApi
            .post(
                '/createEvent',
                {
                    name: form.name,
                    date: form.date,
                    location: form.location,
                    capacity: form.capacity,
                    hour: form.hour,
                },
                {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                }
            )
            .then(response => {
                router.push('/atividades');
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <>
            <GoBack title='Criar Evento' />
            <form
                onSubmit={handleSubmit}
                className='max-w-lg mx-auto mt-10 px-4 py-6 bg-white shadow-md rounded-md space-y-6'
            >
                <div>
                    <label className='block text-gray-800'>Name</label>
                    <input
                        type='text'
                        name='name'
                        value={form.name}
                        onChange={handleChange}
                        className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2'
                    />
                </div>
                <div>
                    <label className='block text-gray-800'>Date</label>
                    <input
                        type='date'
                        name='date'
                        value={form.date}
                        onChange={handleChange}
                        className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2'
                    />
                </div>
                <div>
                    <label className='block text-gray-800'>Location</label>
                    <select
                        name='location'
                        value={form.location}
                        onChange={handleChange}
                        className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2'
                    >
                        <option value=''>Select location</option>
                        {Object.entries(locationMapper).map(([id, name]) => (
                            <option key={id} value={id}>
                                {/* @ts-ignore */}
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className='block text-gray-800'>Capacity</label>
                    <input
                        type='number'
                        name='capacity'
                        value={form.capacity}
                        onChange={handleChange}
                        className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2'
                    />
                </div>
                <div>
                    <label className='block text-gray-800'>Hour</label>
                    <input
                        type='time'
                        name='hour'
                        value={form.hour}
                        onChange={handleChange}
                        className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2'
                    />
                </div>
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
                >
                    Submit
                </button>
            </form>
        </>
    );
};

export default CreateEvent;
