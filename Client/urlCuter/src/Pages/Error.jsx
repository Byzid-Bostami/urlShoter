import React from 'react'

const Error = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-neutral-800 to-neutral-700">

      <div className='flex flex-col space-y-2'>
          <h2 className='text-9xl font-bold text-center text-gray-300 md:text-[200px]'>404</h2>
          <p className='font-medium text-center text-white uppercase '>Page not found</p>
      </div>

    </div>
  )
}

export default Error;