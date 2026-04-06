import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import './App.css'

import { AstronomyBodiesInterface, AstronomySearchInterface } from './astronomyAPI/BodiesApi'
import Home from "./pages/Home";
import ExplorePageDebug from './pages/ExplorePageDebug';
import LoginTesting from './pages/LoginPageDebug';


function App() {
  

  return (
   <div>
    <Router>
      <Routes>
        
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home/>}/>
        <Route path="/explore" element={<ExplorePageDebug/>}/>
        <Route path="/loginTest" element={<LoginTesting />}/>

        {/* Privileged ROUTES */}

      </Routes>
    </Router>
   </div>
  )
}

export default App
