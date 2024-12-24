import React, { useState } from 'react';
import cut from '../assets/url-img.jpg';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const [longUrl, setLongUrl] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
  
    const token = localStorage.getItem("token");
  
    try {
      // Make the POST request
      await axios.post(
        "http://localhost:4000/",
        {
          originalUrl: longUrl,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
  
      // Navigate to the Control page on success
      navigate('/Control');
  
      // Reset form fields
      setLongUrl("");
    } catch (error) {
      console.error("Error posting URL:", error);
  
      // Navigate to the Register page on error
      navigate('/Register');
    }
  };
  

  const handleClick = () => {
    const token = localStorage.getItem('token');

    axios
      .get('http://localhost:4000/', {
        headers: {
          Authorization: token,
        },
      })
      .then(() => {
        navigate('/Control');
      })
      .catch((error) => {
        console.error(error);
        navigate('/Register');
      });
  };

  return (
    <>
      <div className="flex flex-col justify-center min-h-screen bg-gradient-to-br from-neutral-800 to-neutral-700">
        <div className="container px-4 py-5 mx-auto md:px-8 space-y-7 lg:px-12">
          <div className="grid grid-cols-1 py-8 gap-7 md:grid-cols-2 place-items-center">
            <div className="flex flex-col items-start space-y-5">
              <h2 className="text-4xl font-bold text-white capitalize lg:text-5xl">
                More than Shorter Links
              </h2>
              <p className="text-gray-200 capitalize">
                You can shorten your lengthy URLs into concise links, create fully customizable QR codes tailored to your needs, and effortlessly track detailed link clicks.
              </p>
              <button
                onClick={handleClick}
                className="px-4 py-2 font-medium text-black uppercase transition-colors duration-200 bg-white rounded-full hover:bg-black hover:text-white"
              >
                Get Started
              </button>
            </div>

            <div className="flex justify-center rounded-3xl">
              <img className="object-contain md:w-4/5 rounded-3xl" src={cut} alt="cut" />
            </div>
          </div>

          <div className="w-full p-5 mx-auto bg-black md:w-4/6 rounded-xl">
            <form onSubmit={handleSubmit}  className="flex space-x-2">
              <input
                className="w-full p-3 rounded-full outline-none"
                type="text"
                placeholder="Enter Your Long URL"
                onChange={(e)=>setLongUrl(e.target.value)}
                value={longUrl}
              />
              <input
                type="submit"
                value="Shorten it!"
                className="px-4 py-2 font-medium text-white uppercase rounded-full cursor-pointer hover:bg-neutral-300 hover:text-black bg-neutral-800"
              />
            </form>
          </div>
        </div>
      </div>
      <div className="py-8 text-center bg-black">
        <h2 className="text-5xl font-bold text-white uppercase">Boost Your Link Today</h2>
      </div>
    </>
  );
};

export default Home;
