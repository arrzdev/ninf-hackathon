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
        <div>
            <h1 className='flex items-center  text-center text-lg font-semibold'>
                <ArrowBack
                    style={{ cursor: 'pointer' }}
                    onClick={goBack}
                    fontSize='medium'
                    className='mr-2 ml-0'
                />
                <span className='mx-auto text-center text-2xl font-bold mb-2'>
                    {title}
                </span>
            </h1>
        </div>
    );
};
