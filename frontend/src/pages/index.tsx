import React from 'react';
import { api } from '@/services/api';
import { NextPage } from 'next';

const Home:NextPage<any> = ({ data }) => (
  <div className="p-4">
    <h1 className="text-3xl font-bold mb-4">{data.metadata.name}</h1>
    <p className="text-lg mb-4">
      Height: {data.metadata.height} | Lat: {data.metadata.lat} | Lon: {data.metadata.lon}
    </p>
    <table className="w-full text-left border-collapse">
      <thead>
        <tr>
          <th>Date</th>
          <th>Hour</th>
          <th>Wave Height</th>
          <th>Wave Period</th>
          <th>Max Wave Period</th>
          <th>Wave Direction</th>
          <th>Water Temperature</th>
          <th>Water Depth</th>
          <th>Wind Speed</th>
          <th>Wind Direction</th>
          <th>Power</th>
          <th>Beaufort Scale</th>
        </tr>
      </thead>
      <tbody>
        {data.states.map((state, index) => (
          <tr key={index}>
            <td>{state.date}</td>
            <td>{state.hour}</td>
            <td>{state.wave_height}</td>
            <td>{state.wave_period}</td>
            <td>{state.max_wave_period}</td>
            <td>{state.wave_direction}</td>
            <td>{state.water_temperature}</td>
            <td>{state.water_depth}</td>
            <td>{state.wind_speed}</td>
            <td>{state.wind_direction}</td>
            <td>{state.power}</td>
            <td>{state.beaufort_scale}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Home;


const getServerSideProps = async () => {
  const res = await api.get<any>('/locations');

  if (!res?.data) {
    return {
      notFound: true,
    };
  }
  

  return {
    props: {
      data: res.data,
    },
  };
}