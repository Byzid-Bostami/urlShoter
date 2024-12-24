import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrashCan, FaDownload } from "react-icons/fa6";

const Control = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      const res = await axios.get("https://url-cuter.onrender.com/", {
        headers: {
          Authorization: token,
        },
      });
      setData(res.data);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
      console.error(error);
      navigate("/");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const sendUrl = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token not found. Please log in again.");
        return;
      }

      const res = await axios.post(
        "https://url-cuter.onrender.com/",
        {
          originalUrl: url,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // Add the new URL to the data state
      setData((prev) => [...prev, res.data]);

      // Reset form fields
      setUrl("");
    } catch (error) {
      console.error("Error posting task:", error);

      if (error.response && error.response.status === 401) {
        setError("Unauthorized. Please log in again.");
      } else {
        setError("Failed to post the task. Please try again.");
      }
    }
  };

  const deleteURL = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://url-cuter.onrender.com/${id}`, {
        headers: {
          Authorization: token,
        },
      });

      const updatedData = data.filter((item) => item._id !== id);
      setData(updatedData);
    } catch (error) {
      console.log(error);
      setError("Failed to delete URL. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-800 to-neutral-700">
      <div className="container px-4 mx-auto space-y-6 capitalize md:px-12 lg:px-20 py-9">
        <h3 className="text-3xl font-bold text-center text-neutral-300">
          Manage your URL
        </h3>

        {/* Error Message */}
        {error && (
          <div className="p-4 mx-auto text-center bg-red-500 rounded-lg md:w-4/6 text-neutral-100">
            {error}
          </div>
        )}

        {/* URL Shortener Form */}
        <div className="w-full p-5 mx-auto bg-black md:w-4/6 rounded-xl">
          <form onSubmit={sendUrl} className="flex space-x-2">
            <input
              className="p-3 rounded-full outline-none grow"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter Your Long URL"
              required
            />
            <button
              type="submit"
              className="flex items-center px-4 py-2 text-xs font-medium text-center text-white uppercase rounded-full cursor-pointer lg:text-base hover:bg-neutral-300 hover:text-black bg-neutral-800"
            >
              Shorten it!
            </button>
          </form>
        </div>

        {/* Fetched Data Display */}
        {data.length > 0 && (
          <div className="w-full p-5 mx-auto bg-neutral-900 rounded-xl md:w-4/6 text-neutral-100">
            <h4 className="text-lg font-bold text-center">Shortened URLs</h4>

            <div className="mt-4 space-y-4">
              {data.map((item) => (
                <div
                  className="relative flex flex-col items-center justify-between p-4 pb-12 space-y-3 rounded-lg lg:pb-8 lg:space-y-0 bg-neutral-800 lg:flex-row"
                  key={item._id}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold uppercase md:text-base">
                        Main :{" "}
                      </span>
                      <a
                        className="px-1 lowercase bg-red-500 rounded-lg"
                        href={item.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.originalUrl.length > 27
                          ? `${item.originalUrl.slice(0, 27)}...`
                          : item.originalUrl}
                      </a>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold uppercase md:text-base">
                        short:
                      </span>
                      <a
                        className="px-1 lowercase bg-green-500 rounded-lg"
                        href={`http://http://shortlyx/${item.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`http://shortlyx/${item.shortUrl}`.length > 25
                          ? `${`http://http://shortlyx/${item.shortUrl}`.slice(
                              0,
                              25
                            )}...`
                          : `http://http://shortlyx/${item.shortUrl}`}
                      </a>
                      <button
                        className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `http://http://shortlyx/${item.shortUrl}`
                          );
                          alert("Link copied");
                        }}
                      >
                        Copy
                      </button>
                    </div>

                    <p className="text-xs font-semibold uppercase md:text-base ">
                      Clicks : <span>{item.clicks}</span>
                    </p>
                  </div>

                  <div className="relative group">
                    <img className="w-full" src={item.qrCode} alt="QR code" />

                    <div className="absolute top-0 items-center justify-center hidden w-full h-full group-focus:flex group-hover:flex bg-black/15">
                      <a
                        href={item.qrCode}
                        download={item.shortUrl}
                        className="p-4 text-3xl text-center text-white bg-black rounded-full hover:text-green-500 "
                      >
                        <FaDownload />
                      </a>
                    </div>
                  </div>

                  <div className="absolute flex space-x-4 bottom-2 lg:left-3 ">
                    <p className="px-2 py-1 text-xs font-semibold text-white bg-purple-500 rounded-full ">
                      {(() => {
                        const date = new Date(item.createdAt);
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(
                          2,
                          "0"
                        );
                        const day = String(date.getDate()).padStart(2, "0");
                        return `${year}.${month}.${day}`;
                      })()}
                    </p>

                    <button
                      onClick={() => deleteURL(item._id)}
                      className="text-red-500 hover:text-red-800"
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Control;
