import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = ({setToggle}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://url-cuter.onrender.com/login", { username, email, password })
      .then((user) => {
        localStorage.setItem("token", user.data.token);
        console.log(user);
          navigate('/Control');
      })
      .catch((error) => {
        console.log(error);
        setToggle(true);
      });

    setUsername("");
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("https://url-cuter.onrender.com/", {
      headers:{
          Authorization:token,
      }
    })
    .then(()=>{navigate('/Control');})
    .catch((error)=>{
      console.log(error)
      setToggle(true);
    })

  
  },[]);


  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-4">
        <input
          className="p-3 text-black capitalize rounded-full outline-none "
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          placeholder="Enter UserName"
        />
        <input
          className="p-3 text-black capitalize rounded-full outline-none "
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="Enter Email"
        />
        <input
          className="p-3 text-black capitalize rounded-full outline-none "
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          placeholder="Enter Password"
        />
        <input
          className="font-semibold uppercase cursor-pointer hover:text-zinc-400"
          type="submit"
          value="Login"
        />
      </form>
    </div>
  );
};

export default Login;
