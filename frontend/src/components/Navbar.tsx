import React from 'react';

import Head from 'next/head';

import Link from 'next/link';

import { BeachAccess, Newspaper, Directions } from '@mui/icons-material';

export const Navbar = () => {
    return (
        <div className='fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600'>
            <Head>
                <title>Caparica Go</title>
            </Head>
            <div className='grid h-full max-w-lg grid-cols-3 mx-auto font-medium'>
                <Link
                    href='/noticias'
                    type='button'
                    className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group'
                >
                    <svg
                        className='w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500'
                        fill='currentColor'
                    >
                        <Newspaper />
                    </svg>
                    <span className='text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500'>
                        Noticias
                    </span>
                </Link>
                <Link
                    href='/atividades'
                    type='button'
                    className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group'
                >
                    <svg
                        className='w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500'
                        fill='currentColor'
                    >
                        <BeachAccess />
                    </svg>
                    <span className='text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500'>
                        Atividades
                    </span>
                </Link>
                <Link
                    href='/estacionamento'
                    type='button'
                    className='inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group'
                >
                    <svg
                        className='w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500'
                        fill='currentColor'
                    >
                        <Directions />
                    </svg>
                    <span className='text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500'>
                        Estacionamento
                    </span>
                </Link>
            </div>
        </div>
    );
};
