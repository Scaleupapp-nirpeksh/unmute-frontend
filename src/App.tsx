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
import Matches from './pages/Matches/Matches';
import Terms from './pages/Terms/Terms';
import Privacy from './pages/Privacy/Privacy';
import FAQ from './pages/FAQ/FAQ';
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
                <Link to="/matches" className="App-link">Matches</Link>
                <Link to="/login" className="App-link">Login</Link>
                <Link to="/signup" className="App-link">Sign Up</Link>
                <Link to="/terms" className="App-link">Terms</Link>
                <Link to="/privacy" className="App-link">Privacy</Link>
                <Link to="/faq" className="App-link">FAQ</Link>
              </div>
            </nav>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/vents" element={<VentFeed />} />
              <Route path="/vent" element={<VentLayout />}>
                <Route path="create" element={<CreateVent />} />
                <Route path="search" element={<SearchVents />} />
                <Route path=":ventId" element={<VentDetail />} />
              </Route>
              <Route path="/myvents" element={<MyVents />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </div>
        </Router>
      )}
    </>
  );
}

export default App;
