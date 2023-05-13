import React, { useState } from 'react';
import { LockOutlined } from '@mui/icons-material';
import { NextPage } from 'next';

const Login:NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // handle login logic
  };

  return (
    <div className="min-h-screen bg-blue-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold text-blue-800">Caparica GO</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="text-gray-700 font-bold block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border-2 border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="text-gray-700 font-bold block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border-2 border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-800 w-full text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-gray-600 text-center mt-4">
          Don't have an account? <a href="#" className="underline">Sign up here</a>
        </p>  
      </div>
    </div>
  );
};


export default Login;