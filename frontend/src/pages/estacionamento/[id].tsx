import React from 'react';

import { Graph, Progress } from '@/components/Graph';

import { LocationOn } from '@mui/icons-material';
import { GoBack } from '@/components/GoBack';

import { api } from '@/services/api';
import { NextPage } from 'next';

interface ParkingCardData {
  name: string;
  current_capacity: number;
  max_capacity: number;
  address: string;
  location_id: number;
  last_snapshot: string;

  hourly: {
    hour: number;
    capacity: number;
  }[];
}

interface IProps {
  data: ParkingCardData;
}

const ParkingId: NextPage<IProps> = ({ data }) => {
  return (
    <div className="p-4 bg-blue-50">
      <GoBack title={data.name} />
      <div className="mt-8">
        <p className="text-center text-gray-500 flex items-center justify-center">
          <LocationOn className="inline-block mr-2 text-blue-400" />
          <span>{data.address}</span>
        </p>
      </div>
      <div className="mt-8">
        <Progress
          currentCapacity={data.current_capacity}
          maxCapacity={data.max_capacity}
        />
      </div>
      <div className="mt-12">
        <Graph
          data={data.hourly}
          maxCapacity={data.max_capacity}
          currentCapacity={data.current_capacity}
        />
      </div>
      <div className="mt-12">
        <img
          className="w-full h-auto rounded-lg shadow-md"
          src={`data:image/jpeg;base64,${data.last_snapshot}`}
          alt="Base64 Image"
        />
      </div>
    </div>
  );
};

export const getStaticProps = async (context: any) => {
  //get slug from url
  const id = Number(context.params.id);
  console.log(id)

  //fetch single post detail
  const res = await api.get<ParkingCardData>(`/locations/${id}`)

  //return 404 
  if (!res?.data)
    return {
      notFound: true
    }
  return {
    props: {
      data: res.data
    },
    revalidate: 1
  }

}

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { id: "14" } }, { params: { id: "15" } }, { params: { id: "16" } }],
    fallback: 'blocking',
  }
}


export default ParkingId;
