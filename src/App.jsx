import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import './App.css'

import { AstronomyBodiesInterface, AstronomySearchInterface } from './astronomyAPI/BodiesApi'
import Home from "./pages/Home";


function App() {
  

  return (
   <div>
    <Router>
      <Routes>
        
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home/>}/>

        {/* Privileged ROUTES */}

      </Routes>
    </Router>
   </div>
  )
}

export default App
