import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VentFeed from './pages/Vent/VentFeed';
import VentDetail from './pages/Vent/VentDetail';
import SearchVents from './pages/Vent/SearchVents';
import MyVents from './pages/Vent/MyVents'; // Optional
import CreateVent from './pages/Vent/CreateVent';
import VentLayout from './pages/Vent/VentLayout';
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
            <nav className="App-nav">
              <Link to="/" className="App-logo-container">
                <img src={logo} className="App-logo" alt="logo" />
              </Link>
              <div className="App-nav-links">
                <Link to="/" className="App-link">Home</Link>
                <Link to="/vents" className="App-link">Vents</Link>
                <Link to="/login" className="App-link">Login</Link>
                <Link to="/signup" className="App-link">Sign Up</Link>
              </div>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* Nested vent routes */}
              <Route path="/vent" element={<VentLayout />}>
                <Route path="create" element={<CreateVent />} />
                <Route path="search" element={<SearchVents />} />
                <Route path=":ventId" element={<VentDetail />} />
              </Route>
              {/* Vent feed and MyVents can also be separate */}
              <Route path="/vents" element={<VentFeed />} />
              <Route path="/myvents" element={<MyVents />} />
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
}

export default App;
