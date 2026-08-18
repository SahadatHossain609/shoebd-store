import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-9xl font-black text-gray-200 mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-md">Oops! The page you are looking for does not exist. It might have been moved or deleted.</p>
      <Link to="/" className="bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition-colors flex items-center shadow-lg shadow-orange-600/30">
        <ArrowLeft size={20} className="mr-2" /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
