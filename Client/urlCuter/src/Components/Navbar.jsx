import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    localStorage.removeItem("token");
    navigate('/');
  };// Get the current route

  return (
    <div className='bg-neutral-800'>
      <div className='container px-4 mx-auto md:px-8 lg:px-12'>
        <div className='flex flex-row items-center justify-between py-3 text-center'>
          <div className='flex items-center space-x-5 text-white'>
            <Link className='text-2xl font-bold hover:text-gray-300' to='/'>
              Shortly
            </Link>
            <Link
              className='text-sm font-semibold text-gray-300 uppercase hover:text-white'
              to='/Control'
            >
              Urls
            </Link>
          </div>
          <div className='px-3 py-1 text-sm font-medium text-center uppercase rounded-full hover:bg-black hover:text-white bg-slate-200'>
            {location.pathname === '/Control' ? (
              <button onClick={logout}>Logout</button>
            ) : (
              <Link to='/Register'>Register</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
