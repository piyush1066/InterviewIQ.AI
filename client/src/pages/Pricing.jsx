import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { Navigate, useNavigate } from 'react-router-dom';

function Pricing() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-emerald-5 py-16 px-6'>

      <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>

        <button onClick={() => Navigate("/")} className='mt-2 p-3 rounded-full bg-white shadow hover:shadow-md transition'>
          <FaArrowLeft className='text-gray-600' />
        </button>

        <div className='text-center w-full'>
          <h1 className='text-4xl font-bold text-gray-800'>
            Choose Your Plan
          </h1>

          <p className='text-gray-500 mt-3 text-lg'>
              Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Pricing
