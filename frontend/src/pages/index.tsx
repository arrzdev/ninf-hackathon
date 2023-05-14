import React, { useEffect } from 'react';
import { api } from '@/services/api';
import { NextPage } from 'next';

import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';

const Home: NextPage<any> = ({ data }) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

    return <>
      <Navbar/>
      <div>Hello World</div>;
    </>
};

export default Home;
