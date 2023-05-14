import React, { useEffect } from 'react';
import { api } from '@/services/api';
import { NextPage } from 'next';

import { useRouter } from 'next/router';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

interface Article {
  title: string;
  description: string;
  link: string;
  img: string;
  local: string;
}
interface IProps{
  news: Article[];
} 

const Home: NextPage<IProps> = ({ news }) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
    }, [router]);

  return (
    <div className='container mx-auto px-4 py-8'>
    <Navbar />
    <h1 className='text-3xl font-bold mb-12 text-start'>Noticias da Caparica</h1>
      <Navbar/>
        <ul className='mb-16'>
          {news.map((item: Article) => (
            <li key={item.link} className="mb-6">
              <Link target="_blank" href={item.link} className='flex items-center'>
                {item.img && (
                  <div className="w-1/4 mr-4">
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={296}
                      height={197}
                    />
                  </div>
                )}
                <div className="w-3/4">
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="text-gray-500">{item.local}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
};

export default Home;

export const getStaticProps = async () => {
  let { data } = await api.get('/feed');

  //filter out the news that don't have an image
  data = data.filter((item: Article) => item.img);

  return {
    props: {
      news: data,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};