import React, { useState } from 'react';
import SingUp from '../Components/SingUp';
import Login from '../Components/Login';

const Register = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <>
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-neutral-800 to-neutral-700">
      <div className="flex flex-col items-center justify-center w-full h-auto p-6 bg-black lg:w-1/3 md:w-3/5 rounded-xl">
        {/* Buttons for Signup and Login */}
        <div className="flex justify-between mb-6 space-x-4">
          <button
            className={`${
              !toggle ? 'text-black bg-white' : 'text-white bg-gray-800'
            } rounded-full uppercase font-semibold px-4 py-2 transition duration-300 ease-in-out`}
            onClick={() => setToggle(false)}
            aria-pressed={!toggle}
          >
            Signup
          </button>
          <button
            className={`${
              toggle ? 'text-black bg-white' : 'text-white bg-gray-800'
            } rounded-full uppercase font-semibold px-4 py-2 transition duration-300 ease-in-out`}
            onClick={() => setToggle(true)}
            aria-pressed={toggle}
          >
            Login
          </button>
        </div>

        {/* Conditional Content */}
        <div className="w-full text-white">
          {toggle ? (
            <Login setToggle = {setToggle} />
          ) : (
            <SingUp setToggle = {setToggle} />
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;
