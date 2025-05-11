import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white text-2xl font-bold tracking-tight hover:text-blue-200 transition-colors duration-300">
              AutoDoc
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 