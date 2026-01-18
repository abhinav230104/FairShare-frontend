import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginSignup from './LoginSignup'; // Make sure this file exists in the same folder
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- Modal State Logic ---
  const [authType, setAuthType] = useState(null); // 'login', 'signup', or null

  const openLogin = () => setAuthType('login');
  const openSignup = () => setAuthType('signup');
  const closeModal = () => setAuthType(null);
  
//   if(user)
//   {
//     window.location.href = "/dashboard";
//   }
  
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 relative">
      
      {/* --- Navigation Bar --- */}
      <nav className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-3xl">
                ⚖️
              </div>
              <span className="text-3xl font-bold tracking-tight text-gray-900">FairShare</span>
            </div>

            {/* Nav Buttons */}
            <div className="flex items-center gap-4">
              <button 
                onClick={openLogin} 
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Log In
              </button>
              <button 
                onClick={openSignup} 
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Split bills, not <br />
              <span className="text-emerald-600">friendships.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto lg:mx-0">
              The easiest way to track shared expenses for roommates, trips, and groups. 
              No more awkward math or lost receipts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={openSignup}
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1"
              >
                Get Started Free
              </button>
              <button 
                onClick={() => navigate('/dashboard?guest=true')}
                className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-600 hover:text-emerald-600 text-lg font-semibold rounded-xl transition-all group flex items-center justify-center gap-2"
              >
                <span>Continue as Guest</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
            <p className="text-sm text-gray-400">
              No account required for guest access.
            </p>
          </div>

          {/* Hero Visual/Illustration */}
          <div className="relative hidden lg:block h-[500px]">
            {/* Abstract blobs background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 right-20 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

            {/* Floating Cards Mockup */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {/* Card 1 */}
              <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 w-64 transform rotate-6 animate-float">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">🍕</div>
                  <div>
                    <p className="font-bold text-gray-800">Pizza Night</p>
                    <p className="text-xs text-gray-400">Paid by Alex</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <span className="text-sm text-gray-500">You owe</span>
                  <span className="font-bold text-red-500">$15.00</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="absolute top-40 left-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 w-64 transform -rotate-3 animate-float-delayed">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">✈️</div>
                  <div>
                    <p className="font-bold text-gray-800">Trip Flights</p>
                    <p className="text-xs text-gray-400">Paid by You</p>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                  <span className="text-sm text-gray-500">You are owed</span>
                  <span className="font-bold text-emerald-600">$120.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Features Section --- */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why use FairShare?</h2>
            <p className="mt-4 text-gray-600">We make money talk less awkward.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🚀
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Setup</h3>
              <p className="text-gray-500 leading-relaxed">
                Create a group in seconds. Add expenses as you go and let us handle the complex math behind the scenes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Balances</h3>
              <p className="text-gray-500 leading-relaxed">
                See exactly who owes who. We simplify debts to minimize the total number of transactions needed.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-2xl">
                🔒
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Private & Guest Mode</h3>
              <p className="text-gray-500 leading-relaxed">
                Your data is safe. Use our Guest mode for one-off events where you don't want to create an account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} FairShare. Built for peace of mind.
        </div>
      </footer>

      {/* --- Auth Modal (Hidden by default) --- */}
      <LoginSignup type={authType} onClose={closeModal} />
      
    </div>
  );
};

export default Home;