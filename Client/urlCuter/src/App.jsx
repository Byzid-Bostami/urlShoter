import React from 'react'
import Home from './Pages/Home';
import Control from './Pages/Control';
import Register from './Pages/Register';
import Error from './Pages/Error';

import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';

const App = () => {

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Control' element={<Control />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/*' element={<Error />} />
      </Routes>
    </div>
  )
}

export default App;