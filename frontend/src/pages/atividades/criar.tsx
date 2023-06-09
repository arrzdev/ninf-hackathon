import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { nextApi } from '@/services/api';
import { GoBack } from '@/components/GoBack';
import { Navbar } from '@/components/Navbar';

const CreateEvent = () => {
    const router = useRouter();

    const [locationMapper, setLocationMapper] = useState<any>({});
    const [predictedCapacity, setPredictedCapacity] = useState<any>(-1);

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

    //debounce function
    const debounce = (func: any, wait: any, immediate: any) => {
        var timeout: any;

        return (...args: any) => {
            var context = this;

            var later = () => {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            var callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };
    };

    const getPrediction = useCallback(
        debounce(
            async (form: any) => {
                //check if all fields are filled
                if (!form.date || !form.location || !form.hour) {
                    return;
                }

                nextApi
                    .post(
                        '/predictParking',
                        {
                            date: form.date,
                            location: form.location,
                            hour: form.hour,
                        },
                        {
                            headers: {
                                Authorization: localStorage.getItem('token'),
                            },
                        }
                    )
                    .then(res => {
                        setPredictedCapacity(res.data.predicted);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            750,
            false
        ),
        []
    );

    useEffect(() => {
        getPrediction(form);
    }, [form, getPrediction]);

    const handleChange = (event: any) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();

        nextApi
            .post(
                '/createEvent',
                {
                    name: form.name,
                    date: form.date,
                    location: form.location,
                    capacity: form.capacity,
                    hour: form.hour,
                    predictedCapacity,
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
        <div className='flex flex-col h-screen'>
            <Navbar />
            <GoBack title='Criar Atividade' />
            <form
                onSubmit={handleSubmit}
          className='max-w mx-auto mt-10 px-10 py-6 space-y-6 overflow-y-hidden'
            >
                <div>
                    <label htmlFor='name' className='block text-gray-800'>
                      Nome
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={form.name}
                        onChange={handleChange}
                        className='mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2'
                    />
                </div>
                <div>
                    <label htmlFor='date' className='block text-gray-800'>
                        Data
                    </label>
                    <input
                        type='date'
                        id='date'
                        name='date'
                        value={form.date}
                        onChange={handleChange}
                        className='bg-white mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2'
                    />
                </div>
                <div>
                    <label htmlFor='location' className='block text-gray-800'>
                        Localização
                    </label>
                    <select
                        id='location'
                        name='location'
                        value={form.location}
                        onChange={handleChange}
                        className='mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm p-2'
                    >
                        <option value=''>Selecionar localização</option>
                        {Object.entries(locationMapper).map(key => {
                            const id = key[0];
                            const name = key[1] as string;
                            return (
                                <option key={id} value={id}>
                                    {name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor='capacity' className='block text-gray-800'>
                        Vagas
                    </label>
                    <input
                        type='number'
                        id='capacity'
                        name='capacity'
                        value={form.capacity}
                        onChange={handleChange}
                        className='mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm p-2'
                    />
                </div>
                <div>
                    <label htmlFor='hour' className='block text-gray-800'>
                        Hora
                    </label>
                    <input
                        type='time'
                        id='hour'
                        name='hour'
                        value={form.hour}
                        onChange={handleChange}
                        className='mt-1 block w-full bg-white border-gray-300 rounded-md shadow-sm p-2'
                    />
                </div>
                {predictedCapacity !== -1 && (
                    <div className='text-black text-center mt-4'>
                        Estacionamento previsto: {predictedCapacity} lugares
                    </div>
                )}
                <button
                    type='submit'
                    className='w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
                >
                    Criar
                </button>
            </form>
        </div>
    );
};

export default CreateEvent;
