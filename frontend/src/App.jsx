import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';  // this is for routing 
import Homepage from './pages/Homepage';
// import Vouchersheet from './components/VoucherSheet';
import Login from './pages/login';
import Register from './pages/register';

// this is the routing setup 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
         <Route path='login' element={<Login/>}></Route>
         <Route path='register' element={<Register/>}></Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
