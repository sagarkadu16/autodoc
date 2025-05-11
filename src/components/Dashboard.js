import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import PDFUpload from './PDFUpload';

const Dashboard = () => {
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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PDFUpload />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 