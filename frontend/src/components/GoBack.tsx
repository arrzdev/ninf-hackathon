import React from 'react';

import { useRouter } from 'next/router';

import { ArrowBack } from '@mui/icons-material';

interface IGoBackProps {
    title: string;
}

export const GoBack = ({ title }: IGoBackProps) => {
    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    return (
        <div className='sticky top-0 z-10  h-16  text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600'>
            <h1 className='sticky top-4 flex items-center  text-center text-lg font-semibold'>
                <ArrowBack
                    style={{ cursor: 'pointer' }}
                    onClick={goBack}
                    fontSize='medium'
                    className='ml-2'
                />
                <span className='mx-auto text-center text-2xl font-bold mb-2'>
                    {title}
                </span>
            </h1>
        </div>
    );
};
