import React, { useState } from 'react';
import LoginSignup from '../components/landing/LoginSignup'; // Make sure this file exists in the same folder
import { useAuth } from "../contexts/AuthContext";
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import Feature from '../components/landing/Feature';
import Footer from '../components/landing/Footer';

const Landing = () => {
  const { user } = useAuth();

  // --- Modal State Logic ---
  const [authType, setAuthType] = useState(null); // 'login', 'signup', or null
  const openLogin = () => setAuthType('login');
  const openSignup = () => setAuthType('signup');
  const closeModal = () => setAuthType(null);
  
  if(user)
  {
    window.location.href = "/dashboard";
  }
  
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 relative">
      
      <Header 
      openLogin={openLogin}
      openSignup={openSignup}
      />
      <HeroSection
      openSignup={openSignup}
      />
      <Feature/>
      <Footer/>
      <LoginSignup type={authType} onClose={closeModal} />
      
    </div>
  );
};

export default Landing;