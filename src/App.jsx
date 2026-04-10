import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css"
import './App.css'


import { AstronomyBodiesInterface, AstronomySearchInterface } from './astronomyAPI/BodiesApi'
import Home from "./pages/Home";
import ExplorePageDebug from './pages/ExplorePageDebug';
import LoginTesting from './pages/LoginPageDebug';
import Account from './pages/Account';


function App() {


  return (
    <div>
      <Router>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExplorePageDebug />} />
          <Route path="/loginTest" element={<LoginTesting />} />
          <Route path="/account" element={<Account />} />

          {/* Privileged ROUTES */}

        </Routes>
      </Router>
    </div>
  )
}

export default App
