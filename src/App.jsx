import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css"
import './App.css'


import { AstronomyBodiesInterface, AstronomySearchInterface } from './astronomyAPI/BodiesApi'
import Home from "./pages/Home";
import ExplorePageDebug from './pages/ExplorePageDebug';
import LoginTesting from './pages/LoginPageDebug';
//import Account from './pages/Account';
import GeoLocationTestPage from './components/geoLocation/GeoLocationTestPage';


import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import CalendarPage from "./pages/CalendarPage";
import AccountPage from "./pages/AccountPage";
import LoginPage from "./pages/LoginPage";
import BookmarksPage from "./pages/BookmarkPage";
import SolarSystemViewerPage from "./pages/SolarSystemViewerPage";
import PrivacyProtocol from "./pages/PrivacyProtocol";
import TermsOfOrbit from "./pages/TermsOfOrbit";
import Acknowledgments from "./pages/Acknowledgments";
import BookmarksDebug from './pages/testing/bookmarkTest'
import AccountPageTest from './pages/AccountPageTest';
import SatelliteApiTest from './components/NASA_API/SatalliteAPI_Test';





function App() {

  return (
    <div>
      <Router>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/solar-system" element={<SolarSystemViewerPage />} />
          <Route path="/privacy" element={<PrivacyProtocol />} />
          <Route path="/terms" element={<TermsOfOrbit />} />
          <Route path="/acknowledgments" element={<Acknowledgments />} />

          {/* DEBUG ROUTES */}
          <Route path="/debug/home" element={<Home />} />
          <Route path="/debug/explore" element={<ExplorePageDebug />} />
          <Route path="/loginTest" element={<LoginTesting />} />
          <Route path="/bookmarkTest" element={<BookmarksDebug />} />
          <Route path="/accountTest" element={<AccountPageTest />} />
          <Route path="/satelliteTest" element={<SatelliteApiTest />} />
          {/*<Route path="/accountLook" element={<Account/>} />*/}

          {/* PRIVILEGED ROUTES */}

        </Routes>
      </Router>
    </div>
  )
}

export default App