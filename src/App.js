import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ClinicalAssessment from './components/ClinicalAssessment';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const storedName = localStorage.getItem('userName');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setUserName(storedName || 'Doctor');
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUserName(user.name);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserName('');
  };

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // If authenticated, show main app
  return (
    <div className="App">
      <Navbar userName={userName} onLogout={handleLogout} />
      <Hero />
      <Features />
      <ClinicalAssessment />
      <InfoSection />
      <Footer />
    </div>
  );
}

export default App;
