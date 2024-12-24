import React, { useState } from "react";
import axios from 'axios';

const SingUp = ({setToggle}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:4000/register", {username, email, password})
        .then(()=>{
          setToggle(true);
        })
        .catch((error)=>{
            console.log(error);
            setToggle(false);
        })

    setUsername('');
    setEmail('');
    setPassword('');
  };

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
          placeholder="Set Your UserName"
        />
        <input
          className="p-3 text-black capitalize rounded-full outline-none "
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="Set Your Email"
        />
        <input
          className="p-3 text-black capitalize rounded-full outline-none "
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          placeholder="Set a Strong Password"
        />
        <input
          className="font-semibold uppercase cursor-pointer hover:text-zinc-400"
          type="submit"
          value="Sing-up"
        />
      </form>
    </div>
  );
};

export default SingUp;
