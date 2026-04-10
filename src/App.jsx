import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css"
import './App.css'


import { AstronomyBodiesInterface, AstronomySearchInterface } from './astronomyAPI/BodiesApi'
import Home from "./pages/Home";
import ExplorePageDebug from './pages/ExplorePageDebug';
import LoginTesting from './pages/LoginPageDebug';
import Account from './pages/Account';
import GeoLocationTestPage from './components/geoLocation/GeoLocationTestPage';


import HomePage     from "./pages/HomePage";
import ExplorePage  from "./pages/ExplorePage";
import CalendarPage from "./pages/CalendarPage";
import AccountPage  from "./pages/AccountPage";
import LoginPage    from "./pages/LoginPage";

function App() {

  return (
    <div>
      <Router>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/"         element={<LoginPage />} />
          <Route path="/home"     element={<HomePage />} />
          <Route path="/explore"  element={<ExplorePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/account"  element={<AccountPage />} />

          {/* DEBUG ROUTES */}
          <Route path="/debug/home"    element={<Home />} />
          <Route path="/debug/explore" element={<ExplorePageDebug />} />
          <Route path="/loginTest"     element={<LoginTesting />} />

          {/* PRIVILEGED ROUTES */}

        </Routes>
      </Router>
    </div>
  )
}

export default App