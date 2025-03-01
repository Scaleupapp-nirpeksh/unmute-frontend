// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VentFeed from './pages/Vent/VentFeed';
import VentDetail from './pages/Vent/VentDetail';
import CreateVent from './pages/Vent/CreateVent';
import SearchVents from './pages/Vent/SearchVents';
import MyVents from './pages/Vent/MyVents';
import VentLayout from './pages/Vent/VentLayout';
import Matches from './pages/Matches/Matches';  // <-- Import the Matches page
import logo from './assets/logo.png';
import SplashScreen from './components/SplashScreen';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
      {!showSplash && (
        <Router>
          <div className="App">
            {/* Navigation Bar */}
            <nav className="App-nav">
              <Link to="/" className="App-logo-container">
                <img src={logo} className="App-logo" alt="logo" />
              </Link>
              <div className="App-nav-links">
                <Link to="/" className="App-link">Home</Link>
                <Link to="/vents" className="App-link">Vents</Link>
                <Link to="/matches" className="App-link">Matches</Link>  {/* <-- New link */}
                <Link to="/login" className="App-link">Login</Link>
                <Link to="/signup" className="App-link">Sign Up</Link>
              </div>
            </nav>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Main Vent Section */}
              <Route path="/vents" element={<VentFeed />} />
              <Route path="/vent" element={<VentLayout />}>
                <Route path="create" element={<CreateVent />} />
                <Route path="search" element={<SearchVents />} />
                <Route path=":ventId" element={<VentDetail />} />
              </Route>
              <Route path="/myvents" element={<MyVents />} />

              {/* Matches Route */}
              <Route path="/matches" element={<Matches />} />  {/* <-- New route */}
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
}

export default App;
