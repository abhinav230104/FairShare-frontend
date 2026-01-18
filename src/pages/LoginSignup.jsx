import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

const LoginSignup = ({ type, onClose }) => {
  const { login, signup } = useAuth();
  
  const [name, setName]= useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(type); // 'login' or 'signup'
  const [error, setError] = useState("");
  const [message, setMessage]= useState("");
  // Trigger animation when 'type' prop changes
  useEffect(() => {
    if (type) {
      setActiveTab(type);
      setError(""); // Clear errors on open
      setMessage(""); // Clear message on open
      setTimeout(() => setIsVisible(true), 10); 
    } else {
      setIsVisible(false);
    }
  }, [type]);

  // Handle closing with animation delay
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); 
  };
  
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard"); 
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Please check your credentials.");
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await signup(name, email, password);
      setActiveTab("login");
      setMessage("Account created successfully!")
    } catch (err) {
      console.error(err);
      setError("Failed to create account.");
    }
  };

  // If no type is passed, don't render anything
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24 px-4">
      
      {/* 1. Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* 2. Modal Content */}
      <div 
        className={`bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative transform transition-all duration-300 ease-out ${
          isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-8 opacity-0 scale-95'
        }`}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="p-8 pb-6">
          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {error}
            </div>
          )}
          {/* Message Display */}
          {message && (
            <div className="mb-4 p-3 bg-green-50 text-green-400 text-sm rounded-lg border border-red-100 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {message}
            </div>
          )}
          
          {/* Tabs */}
          <div className="flex gap-6 mb-8 border-b border-gray-100">
            <button 
              className={`pb-3 text-lg font-bold transition-all relative ${activeTab === 'login' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setActiveTab('login')}
            >
              Log In
              {activeTab === 'login' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></span>}
            </button>
            <button 
              className={`pb-3 text-lg font-bold transition-all relative ${activeTab === 'signup' ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
              {activeTab === 'signup' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></span>}
            </button>
          </div>

          <form onSubmit={activeTab === "login" ? handleLoginSubmit : handleSignupSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e)=>setName(e.target.value)} 
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e)=>setEmail(e.target.value)} 
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-gray-50 focus:bg-white"
                required
              />
            </div>

            {activeTab === 'login' && (
               <div className="flex justify-end">
                 <button type="button" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">Forgot password?</button>
               </div>
            )}

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
            >
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-600 text-sm">
              Google
            </button>
            <button className="flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-600 text-sm">
              Apple
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-100">
           <p className="text-sm text-gray-500">
             {activeTab === 'login' ? "Don't have an account? " : "Already have an account? "}
             <button 
               className="text-emerald-600 font-bold hover:underline"
               onClick={() => setActiveTab(activeTab === 'login' ? 'signup' : 'login')}
             >
               {activeTab === 'login' ? 'Sign up' : 'Log in'}
             </button>
           </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;