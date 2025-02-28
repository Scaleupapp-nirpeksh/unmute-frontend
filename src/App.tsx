import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import logo from './assets/logo.png';
import './App.css';

// Import your new SplashScreen component
import SplashScreen from './components/SplashScreen';

function App() {
  // State to track whether to show the splash screen
  const [showSplash, setShowSplash] = useState(true);

  // Callback when splash finishes
  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <>
      {/* If showSplash is true, show the splash. Otherwise, show the main app */}
      {showSplash && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}
      
      {!showSplash && (
        <Router>
          <div className="App">
            {/* Navigation Bar */}
            <nav className="App-nav">
              <Link to="/" className="App-logo-container">
                <img src={logo} className="App-logo" alt="logo" />
              </Link>
              <div className="App-nav-links">
                <Link to="/login" className="App-link">Login</Link>
                <Link to="/signup" className="App-link">Sign Up</Link>
              </div>
            </nav>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
}

export default App;
