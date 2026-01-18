import React from 'react'

function Footer() {
    return (
       <footer className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} FairShare. Built for peace of mind.
        </div>
      </footer> 
    )
}

export default Footer
