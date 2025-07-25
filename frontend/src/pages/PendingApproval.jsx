import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPending = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen white px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold !text-gray-800 mb-4">
          Registration Pending
        </h1>
        <p className="!text-gray-900 text-base mb-6 leading-relaxed">
          Thank you for registering! Your account is currently under review by the admin.
          <br />
          Please check back later or wait for the update.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-md transition-all duration-300 shadow-md w-full"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default RegistrationPending;
