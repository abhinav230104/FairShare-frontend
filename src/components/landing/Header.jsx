import React from 'react'

function Header({openLogin,openSignup}) {
    return (
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
    )
}

export default Header
